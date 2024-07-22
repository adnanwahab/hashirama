// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: © 2017 LabStack and Echo contributors

/*
Package echoprometheus provides middleware to add Prometheus metrics.
*/
package echoprometheus

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/prometheus/common/expfmt"
	"io"
	"net/http"
	"sort"
	"strconv"
	"time"
)

const (
	defaultSubsystem = "echo"
)

const (
	_           = iota // ignore first value by assigning to blank identifier
	bKB float64 = 1 << (10 * iota)
	bMB
)

// sizeBuckets is the buckets for request/response size. Here we define a spectrum from 1KB through 1NB up to 10MB.
var sizeBuckets = []float64{1.0 * bKB, 2.0 * bKB, 5.0 * bKB, 10.0 * bKB, 100 * bKB, 500 * bKB, 1.0 * bMB, 2.5 * bMB, 5.0 * bMB, 10.0 * bMB}

// MiddlewareConfig contains the configuration for creating prometheus middleware collecting several default metrics.
type MiddlewareConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper middleware.Skipper

	// Namespace is components of the fully-qualified name of the Metric (created by joining Namespace,Subsystem and Name components with "_")
	// Optional
	Namespace string

	// Subsystem is components of the fully-qualified name of the Metric (created by joining Namespace,Subsystem and Name components with "_")
	// Defaults to: "echo"
	Subsystem string

	// LabelFuncs allows adding custom labels in addition to default labels. When key has same name with default label
	// it replaces default one.
	LabelFuncs map[string]LabelValueFunc

	// HistogramOptsFunc allows to change options for metrics of type histogram before metric is registered to Registerer
	HistogramOptsFunc func(opts prometheus.HistogramOpts) prometheus.HistogramOpts

	// CounterOptsFunc allows to change options for metrics of type counter before metric is registered to Registerer
	CounterOptsFunc func(opts prometheus.CounterOpts) prometheus.CounterOpts

	// Registerer sets the prometheus.Registerer instance the middleware will register these metrics with.
	// Defaults to: prometheus.DefaultRegisterer
	Registerer prometheus.Registerer

	// BeforeNext is callback that is executed before next middleware/handler is called. Useful for case when you have own
	// metrics that need data to be stored for AfterNext.
	BeforeNext func(c echo.Context)

	// AfterNext is callback that is executed after next middleware/handler returns. Useful for case when you have own
	// metrics that need incremented/observed.
	AfterNext func(c echo.Context, err error)

	timeNow func() time.Time

	// If DoNotUseRequestPathFor404 is true, all 404 responses (due to non-matching route) will have the same `url` label and
	// thus won't generate new metrics.
	DoNotUseRequestPathFor404 bool
}

type LabelValueFunc func(c echo.Context, err error) string

// HandlerConfig contains the configuration for creating HTTP handler for metrics.
type HandlerConfig struct {
	// Gatherer sets the prometheus.Gatherer instance the middleware will use when generating the metric endpoint handler.
	// Defaults to: prometheus.DefaultGatherer
	Gatherer prometheus.Gatherer
}

// PushGatewayConfig contains the configuration for pushing to a Prometheus push gateway.
type PushGatewayConfig struct {
	// PushGatewayURL is push gateway URL in format http://domain:port
	PushGatewayURL string

	// PushInterval in ticker interval for pushing gathered metrics to the Gateway
	// Defaults to: 1 minute
	PushInterval time.Duration

	// Gatherer sets the prometheus.Gatherer instance the middleware will use when generating the metric endpoint handler.
	// Defaults to: prometheus.DefaultGatherer
	Gatherer prometheus.Gatherer

	// ErrorHandler is function that is called when errors occur. When callback returns error StartPushGateway also returns.
	ErrorHandler func(err error) error

	// ClientTransport specifies the mechanism by which individual HTTP POST requests are made.
	// Defaults to: http.DefaultTransport
	ClientTransport http.RoundTripper
}

// NewHandler creates new instance of Handler using Prometheus default registry.
func NewHandler() echo.HandlerFunc {
	return NewHandlerWithConfig(HandlerConfig{})
}

// NewHandlerWithConfig creates new instance of Handler using given configuration.
func NewHandlerWithConfig(config HandlerConfig) echo.HandlerFunc {
	if config.Gatherer == nil {
		config.Gatherer = prometheus.DefaultGatherer
	}
	h := promhttp.HandlerFor(config.Gatherer, promhttp.HandlerOpts{DisableCompression: true})

	if r, ok := config.Gatherer.(prometheus.Registerer); ok {
		h = promhttp.InstrumentMetricHandler(r, h)
	}

	return func(c echo.Context) error {
		h.ServeHTTP(c.Response(), c.Request())
		return nil
	}
}

// NewMiddleware creates new instance of middleware using Prometheus default registry.
func NewMiddleware(subsystem string) echo.MiddlewareFunc {
	return NewMiddlewareWithConfig(MiddlewareConfig{Subsystem: subsystem})
}

// NewMiddlewareWithConfig creates new instance of middleware using given configuration.
func NewMiddlewareWithConfig(config MiddlewareConfig) echo.MiddlewareFunc {
	mw, err := config.ToMiddleware()
	if err != nil {
		panic(err)
	}
	return mw
}

// ToMiddleware converts configuration to middleware or returns an error.
func (conf MiddlewareConfig) ToMiddleware() (echo.MiddlewareFunc, error) {
	if conf.timeNow == nil {
		conf.timeNow = time.Now
	}
	if conf.Subsystem == "" {
		conf.Subsystem = defaultSubsystem
	}
	if conf.Registerer == nil {
		conf.Registerer = prometheus.DefaultRegisterer
	}
	if conf.CounterOptsFunc == nil {
		conf.CounterOptsFunc = func(opts prometheus.CounterOpts) prometheus.CounterOpts {
			return opts
		}
	}
	if conf.HistogramOptsFunc == nil {
		conf.HistogramOptsFunc = func(opts prometheus.HistogramOpts) prometheus.HistogramOpts {
			return opts
		}
	}

	labelNames, customValuers := createLabels(conf.LabelFuncs)

	requestCount := prometheus.NewCounterVec(
		conf.CounterOptsFunc(prometheus.CounterOpts{
			Namespace: conf.Namespace,
			Subsystem: conf.Subsystem,
			Name:      "requests_total",
			Help:      "How many HTTP requests processed, partitioned by status code and HTTP method.",
		}),
		labelNames,
	)
	// we do not allow skipping or replacing default collector but developer can use `conf.CounterOptsFunc` to rename
	// this middleware default collector, so they can have own collector with that same name.
	// and we treat all register errors as returnable failures
	if err := conf.Registerer.Register(requestCount); err != nil {
		return nil, err
	}

	requestDuration := prometheus.NewHistogramVec(
		conf.HistogramOptsFunc(prometheus.HistogramOpts{
			Namespace: conf.Namespace,
			Subsystem: conf.Subsystem,
			Name:      "request_duration_seconds",
			Help:      "The HTTP request latencies in seconds.",
			// Here, we use the prometheus defaults which are for ~10s request length max: []float64{.005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5, 10}
			Buckets: prometheus.DefBuckets,
		}),
		labelNames,
	)
	if err := conf.Registerer.Register(requestDuration); err != nil {
		return nil, err
	}

	responseSize := prometheus.NewHistogramVec(
		conf.HistogramOptsFunc(prometheus.HistogramOpts{
			Namespace: conf.Namespace,
			Subsystem: conf.Subsystem,
			Name:      "response_size_bytes",
			Help:      "The HTTP response sizes in bytes.",
			Buckets:   sizeBuckets,
		}),
		labelNames,
	)
	if err := conf.Registerer.Register(responseSize); err != nil {
		return nil, err
	}

	requestSize := prometheus.NewHistogramVec(
		conf.HistogramOptsFunc(prometheus.HistogramOpts{
			Namespace: conf.Namespace,
			Subsystem: conf.Subsystem,
			Name:      "request_size_bytes",
			Help:      "The HTTP request sizes in bytes.",
			Buckets:   sizeBuckets,
		}),
		labelNames,
	)
	if err := conf.Registerer.Register(requestSize); err != nil {
		return nil, err
	}

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// NB: we do not skip metrics handler path by default. This can be added with custom Skipper but for default
			// behaviour we measure metrics path request/response metrics also
			if conf.Skipper != nil && conf.Skipper(c) {
				return next(c)
			}

			if conf.BeforeNext != nil {
				conf.BeforeNext(c)
			}
			reqSz := computeApproximateRequestSize(c.Request())

			start := conf.timeNow()
			err := next(c)
			elapsed := float64(conf.timeNow().Sub(start)) / float64(time.Second)

			if conf.AfterNext != nil {
				conf.AfterNext(c, err)
			}

			url := c.Path() // contains route path ala `/users/:id`
			if url == "" && !conf.DoNotUseRequestPathFor404 {
				// as of Echo v4.10.1 path is empty for 404 cases (when router did not find any matching routes)
				// in this case we use actual path from request to have some distinction in Prometheus
				url = c.Request().URL.Path
			}

			status := c.Response().Status
			if err != nil {
				var httpError *echo.HTTPError
				if errors.As(err, &httpError) {
					status = httpError.Code
				}
				if status == 0 || status == http.StatusOK {
					status = http.StatusInternalServerError
				}
			}

			values := make([]string, len(labelNames))
			values[0] = strconv.Itoa(status)
			values[1] = c.Request().Method
			values[2] = c.Request().Host
			values[3] = url
			for _, cv := range customValuers {
				values[cv.index] = cv.valueFunc(c, err)
			}

			requestDuration.WithLabelValues(values...).Observe(elapsed)
			requestCount.WithLabelValues(values...).Inc()
			requestSize.WithLabelValues(values...).Observe(float64(reqSz))
			responseSize.WithLabelValues(values...).Observe(float64(c.Response().Size))

			return err
		}
	}, nil
}

type customLabelValuer struct {
	index     int
	label     string
	valueFunc LabelValueFunc
}

func createLabels(customLabelFuncs map[string]LabelValueFunc) ([]string, []customLabelValuer) {
	labelNames := []string{"code", "method", "host", "url"}
	if len(customLabelFuncs) == 0 {
		return labelNames, nil
	}

	customValuers := make([]customLabelValuer, 0)
	// we create valuers in two passes for a reason - first to get fixed order, and then we know to assign correct indexes
	for label, labelFunc := range customLabelFuncs {
		customValuers = append(customValuers, customLabelValuer{
			label:     label,
			valueFunc: labelFunc,
		})
	}
	sort.Slice(customValuers, func(i, j int) bool {
		return customValuers[i].label < customValuers[j].label
	})

	for cvIdx, cv := range customValuers {
		idx := containsAt(labelNames, cv.label)
		if idx == -1 {
			idx = len(labelNames)
			labelNames = append(labelNames, cv.label)
		}
		customValuers[cvIdx].index = idx
	}
	return labelNames, customValuers
}

func containsAt[K comparable](haystack []K, needle K) int {
	for i, v := range haystack {
		if v == needle {
			return i
		}
	}
	return -1
}

func computeApproximateRequestSize(r *http.Request) int {
	s := 0
	if r.URL != nil {
		s = len(r.URL.Path)
	}

	s += len(r.Method)
	s += len(r.Proto)
	for name, values := range r.Header {
		s += len(name)
		for _, value := range values {
			s += len(value)
		}
	}
	s += len(r.Host)

	// N.B. r.Form and r.MultipartForm are assumed to be included in r.URL.

	if r.ContentLength != -1 {
		s += int(r.ContentLength)
	}
	return s
}

// RunPushGatewayGatherer starts pushing collected metrics and waits for it context to complete or ErrorHandler to return error.
//
// Example:
// ```
//
//	go func() {
//		config := echoprometheus.PushGatewayConfig{
//			PushGatewayURL: "https://host:9080",
//			PushInterval:   10 * time.Millisecond,
//		}
//		if err := echoprometheus.RunPushGatewayGatherer(context.Background(), config); !errors.Is(err, context.Canceled) {
//			log.Fatal(err)
//		}
//	}()
//
// ```
func RunPushGatewayGatherer(ctx context.Context, config PushGatewayConfig) error {
	if config.PushGatewayURL == "" {
		return errors.New("push gateway URL is missing")
	}
	if config.PushInterval <= 0 {
		config.PushInterval = 1 * time.Minute
	}
	if config.Gatherer == nil {
		config.Gatherer = prometheus.DefaultGatherer
	}
	if config.ErrorHandler == nil {
		config.ErrorHandler = func(err error) error {
			log.Error(err)
			return nil
		}
	}

	client := &http.Client{
		Transport: config.ClientTransport,
	}
	out := &bytes.Buffer{}

	ticker := time.NewTicker(config.PushInterval)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			out.Reset()
			err := WriteGatheredMetrics(out, config.Gatherer)
			if err != nil {
				if hErr := config.ErrorHandler(fmt.Errorf("failed to create metrics: %w", err)); hErr != nil {
					return hErr
				}
				continue
			}
			req, err := http.NewRequestWithContext(ctx, http.MethodPost, config.PushGatewayURL, out)
			if err != nil {
				if hErr := config.ErrorHandler(fmt.Errorf("failed to create push gateway request: %w", err)); hErr != nil {
					return hErr
				}
				continue
			}
			res, err := client.Do(req)
			if err != nil {
				if hErr := config.ErrorHandler(fmt.Errorf("error sending to push gateway: %w", err)); hErr != nil {
					return hErr
				}
			}
			if res.StatusCode != http.StatusOK {
				if hErr := config.ErrorHandler(echo.NewHTTPError(res.StatusCode, "post metrics request did not succeed")); hErr != nil {
					return hErr
				}
			}
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

// WriteGatheredMetrics gathers collected metrics and writes them to given writer
func WriteGatheredMetrics(writer io.Writer, gatherer prometheus.Gatherer) error {
	metricFamilies, err := gatherer.Gather()
	if err != nil {
		return err
	}
	for _, mf := range metricFamilies {
		if _, err := expfmt.MetricFamilyToText(writer, mf); err != nil {
			return err
		}
	}
	return nil
}
