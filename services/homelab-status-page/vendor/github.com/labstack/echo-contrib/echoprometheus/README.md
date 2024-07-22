# Usage

```
package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo-contrib/echoprometheus"
)

func main() {
    e := echo.New()
    // Enable metrics middleware
    e.Use(echoprometheus.NewMiddleware("myapp"))
    e.GET("/metrics", echoprometheus.NewHandler())

    e.Logger.Fatal(e.Start(":1323"))
}
```


# How to migrate

## Creating and adding middleware to the application

Older `prometheus` middleware
```go
    e := echo.New()
    p := prometheus.NewPrometheus("echo", nil)
    p.Use(e)
```

With the new `echoprometheus` middleware
```go
    e := echo.New()
    e.Use(echoprometheus.NewMiddleware("myapp")) // register middleware to gather metrics from requests
    e.GET("/metrics", echoprometheus.NewHandler()) // register route to serve gathered metrics in Prometheus format
```

## Replacement for `Prometheus.MetricsList` field, `NewMetric(m *Metric, subsystem string)` function and `prometheus.Metric` struct

The `NewMetric` function allowed to create custom metrics with the old `prometheus` middleware. This helper is no longer available 
to avoid the added complexity. It is recommended to use native Prometheus metrics and register those yourself.

This can be done now as follows:
```go
	e := echo.New()

	customRegistry := prometheus.NewRegistry() // create custom registry for your custom metrics
	customCounter := prometheus.NewCounter( // create new counter metric. This is replacement for `prometheus.Metric` struct
		prometheus.CounterOpts{
			Name: "custom_requests_total",
			Help: "How many HTTP requests processed, partitioned by status code and HTTP method.",
		},
	)
	if err := customRegistry.Register(customCounter); err != nil { // register your new counter metric with metrics registry
		log.Fatal(err)
	}

	e.Use(NewMiddlewareWithConfig(MiddlewareConfig{
		AfterNext: func(c echo.Context, err error) {
			customCounter.Inc() // use our custom metric in middleware. after every request increment the counter
		},
		Registerer: customRegistry, // use our custom registry instead of default Prometheus registry
	}))
	e.GET("/metrics", NewHandlerWithConfig(HandlerConfig{Gatherer: customRegistry})) // register route for getting gathered metrics data from our custom Registry
```

## Replacement for `Prometheus.MetricsPath`

`MetricsPath` was used to skip metrics own route from Prometheus metrics. Skipping is no longer done and requests to Prometheus
route will be included in gathered metrics.

To restore the old behaviour the `/metrics` path needs to be excluded from counting using the Skipper function:
```go
conf := echoprometheus.MiddlewareConfig{
    Skipper: func(c echo.Context) bool {
        return c.Path() == "/metrics"
    },
}
e.Use(echoprometheus.NewMiddlewareWithConfig(conf))
```

## Replacement for `Prometheus.RequestCounterURLLabelMappingFunc` and `Prometheus.RequestCounterHostLabelMappingFunc`

These function fields were used to define how "URL" or "Host" attribute in Prometheus metric lines are created.

These can now be substituted by using `LabelFuncs`:
```go
	e.Use(echoprometheus.NewMiddlewareWithConfig(echoprometheus.MiddlewareConfig{
		LabelFuncs: map[string]echoprometheus.LabelValueFunc{
			"scheme": func(c echo.Context, err error) string { // additional custom label
				return c.Scheme()
			},
			"url": func(c echo.Context, err error) string { // overrides default 'url' label value
				return "x_" + c.Request().URL.Path
			},
			"host": func(c echo.Context, err error) string { // overrides default 'host' label value
				return "y_" + c.Request().Host
			},
		},
	}))
```

Will produce Prometheus line as
`echo_request_duration_seconds_count{code="200",host="y_example.com",method="GET",scheme="http",url="x_/ok",scheme="http"} 1`


## Replacement for `Metric.Buckets` and modifying default metrics

The `echoprometheus` middleware registers the following metrics by default:

* Counter `requests_total`
* Histogram `request_duration_seconds`
* Histogram `response_size_bytes`
* Histogram `request_size_bytes`

You can modify their definition before these metrics are registed with  `CounterOptsFunc` and `HistogramOptsFunc` callbacks

Example:
```go
	e.Use(NewMiddlewareWithConfig(MiddlewareConfig{
		HistogramOptsFunc: func(opts prometheus.HistogramOpts) prometheus.HistogramOpts {
			if opts.Name == "request_duration_seconds" {
                opts.Buckets = []float64{1.0 * bKB, 2.0 * bKB, 5.0 * bKB, 10.0 * bKB, 100 * bKB, 500 * bKB, 1.0 * bMB, 2.5 * bMB, 5.0 * bMB, 10.0 * bMB}
			}
			return opts
		},
        CounterOptsFunc: func(opts prometheus.CounterOpts) prometheus.CounterOpts {
            if opts.Name == "requests_total" {
                opts.ConstLabels = prometheus.Labels{"my_const": "123"}
            }
            return opts
        },
	}))
```

## Replacement for `PushGateway` struct and related methods

Function `RunPushGatewayGatherer` starts pushing collected metrics and block until context completes or ErrorHandler returns an error.
This function should be run in separate goroutine.

Example:
```go
	go func() {
		config := echoprometheus.PushGatewayConfig{
			PushGatewayURL: "https://host:9080",
			PushInterval:   10 * time.Millisecond,
		}
		if err := echoprometheus.RunPushGatewayGatherer(context.Background(), config); !errors.Is(err, context.Canceled) {
			log.Fatal(err)
		}
	}()
```