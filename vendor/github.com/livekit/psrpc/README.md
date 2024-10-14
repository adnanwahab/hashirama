# PubSub-RPC

Create custom protobuf-based golang RPCs built on pub/sub.

Supports:
* Protobuf service definitions
* Use Redis, Nats, or a local communication layer
* Custom server selection for RPC handling based on user-defined [affinity](#Affinity)
* RPC topics - any RPC can be divided into topics, (e.g. by region)
* Single RPCs - one request is handled by one server, used for normal RPCs
* Multi RPCs - one request is handled by every server, used for distributed updates or result aggregation
* Queue Subscriptions - updates sent from the server will only be processed by a single client
* Subscriptions - updates sent be the server will be processed by every client

## Usage

### Protobuf

PSRPC is generated from proto files, and we've added a few custom method options:
```protobuf
message Options {
  // This method is a pub/sub.
  bool subscription = 1;

  // This method uses topics.
  bool topics = 2;

  TopicParamOptions topic_params = 3;

  // The method uses bidirectional streaming.
  bool stream = 4;

  oneof routing {
    // For RPCs, each client request will receive a response from every server.
    // For subscriptions, every client will receive every update.
    bool multi = 5;

    // Your service will supply an affinity function for handler selection.
    bool affinity_func = 6;

    // Requests load balancing is provided by a pub/sub server queue
    bool queue = 7;
  }
}

```

Start with your service definition. Here's an example using different method options:

```protobuf
syntax = "proto3";

import "options.proto";

option go_package = "/api";

service MyService {
  // A normal RPC - one request, one response. The request will be handled by the first available server
  rpc NormalRPC(MyRequest) returns (MyResponse);

  // An RPC with a server affinity function for handler selection.
  rpc IntensiveRPC(MyRequest) returns (MyResponse) {
    option (psrpc.options).type = AFFINITY;
  };

  // A multi-rpc - a client will send one request, and receive one response each from every server
  rpc GetStats(MyRequest) returns (MyResponse) {
    option (psrpc.options).type = MULTI;
  };

  // A streaming RPC - a client opens a stream, the first server to respond accepts it and both send and
  // receive messages until one side closes the stream.
  rpc ExchangeUpdates(MyClientMessage) returns (MyServerMessage) {
    option (psrpc.options).stream = true;
  };

  // An RPC with topics - a client can send one request, and receive one response from each server in one region
  rpc GetRegionStats(MyRequest) returns (MyResponse) {
    option (psrpc.options).topics = true;
    option (psrpc.options).type = MULTI;
  }

  // A queue subscription - even if multiple clients are subscribed, only one will receive this update.
  // The request parameter (in this case, Ignored) will always be ignored when generating go files.
  rpc ProcessUpdate(Ignored) returns (MyUpdate) {
    option (psrpc.options).subscription = true;
  };

  // A normal subscription - every client will receive every update.
  // The request parameter (in this case, Ignored) will always be ignored when generating go files.
  rpc UpdateState(Ignored) returns (MyUpdate) {
    option (psrpc.options).subscription = true;
    option (psrpc.options).type = MULTI;
  };

  // A subscription with topics - every client subscribed to the topic will receive every update.
  // The request parameter (in this case, Ignored) will always be ignored when generating go files.
  rpc UpdateRegionState(Ignored) returns (MyUpdate) {
    option (psrpc.options).subscription = true;
    option (psrpc.options).topics = true;
    option (psrpc.options).type = MULTI;
  }
}

message Ignored {}
message MyRequest {}
message MyResponse {}
message MyUpdate {}
message MyClientMessage {}
message MyServerMessage {}
```

### Generation

Install `protoc-gen-psrpc` by running `go install github.com/livekit/psrpc/protoc-gen-psrpc`.

If using the custom options above, you'll also need to include [options.proto](protoc-gen-psrpc/options/options.proto).
The simplest way to do this is to include psrpc in your project, then run
```shell
go list -json -m github.com/livekit/psrpc

{
	"Path": "github.com/livekit/psrpc",
	"Version": "v0.2.2",
	"Time": "2022-12-27T21:40:05Z",
	"Dir": "/Users/dc/go/pkg/mod/github.com/livekit/psrpc@v0.2.2",
	"GoMod": "/Users/dc/go/pkg/mod/cache/download/github.com/livekit/psrpc/@v/v0.2.2.mod",
	"GoVersion": "1.20"
}
```

Use the `--psrpc_out` with `protoc` and include the options directory.

```shell
protoc \
  --go_out=paths=source_relative:. \
  --psrpc_out=paths=source_relative:. \
  -I /Users/dc/go/pkg/mod/github.com/livekit/psrpc@v0.2.2/protoc-gen-psrpc/options \
  -I=. my_service.proto
```

This will create a `my_service.psrpc.go` file.

### Client

A `MyServiceClient` will be generated based on your rpc definitions:

```go
type MyServiceClient interface {
    // A normal RPC - one request, one response. The request will be handled by the first available server
    NormalRPC(ctx context.Context, req *MyRequest, opts ...psrpc.RequestOpt) (*MyResponse, error)

    // An RPC with a server affinity function for handler selection.
    IntensiveRPC(ctx context.Context, req *MyRequest, opts ...psrpc.RequestOpt) (*MyResponse, error)

    // A multi-rpc - a client will send one request, and receive one response each from every server
    GetStats(ctx context.Context, req *MyRequest, opts ...psrpc.RequestOpt) (<-chan *psrpc.Response[*MyResponse], error)

    // A streaming RPC - a client opens a stream, the first server to respond accepts it and both send and
    // receive messages until one side closes the stream.
    ExchangeUpdates(ctx context.Context, opts ...psrpc.RequestOpt) (psrpc.ClientStream[*MyClientMessage, *MyServerMessage], error)

    // An RPC with topics - a client can send one request, and receive one response from each server in one region
    GetRegionStats(ctx context.Context, topic string, req *Request, opts ...psrpc.RequestOpt) (<-chan *psrpc.Response[*MyResponse], error)

    // A queue subscription - even if multiple clients are subscribed, only one will receive this update.
    SubscribeProcessUpdate(ctx context.Context) (psrpc.Subscription[*MyUpdate], error)

    // A subscription with topics - every client subscribed to the topic will receive every update.
    SubscribeUpdateRegionState(ctx context.Context, topic string) (psrpc.Subscription[*MyUpdate], error)
}

// NewMyServiceClient creates a psrpc client that implements the MyServiceClient interface.
func NewMyServiceClient(clientID string, bus psrpc.MessageBus, opts ...psrpc.ClientOpt) (MyServiceClient, error) {
    ...
}
```

Multi-RPCs will return a `chan *psrpc.Response`, where you will receive an individual response or error from each server:
```go
type Response[ResponseType proto.Message] struct {
    Result ResponseType
    Err    error
}
```

Streaming RPCs will return a `psrpc.ClientStream`. You can listen for updates from its channel, send updates, or close
the stream.

Send blocks until the message has been received. When the stream closes the cause is available to both the server and
client from `Err`.
```go
type ClientStream[SendType, RecvType proto.Message] interface {
	Channel() <-chan RecvType
	Send(msg SendType, opts ...StreamOption) error
	Close(cause error) error
	Err() error
}
```

Subscription RPCs will return a `psrpc.Subscription`, where you can listen for updates on its channel:

```go
type Subscription[MessageType proto.Message] interface {
    Channel() <-chan MessageType
    Close() error
}
```

### ServerImpl

A `<ServiceName>ServerImpl` interface will be also be generated from your rpcs. Your service will need to fulfill its interface:

```go
type MyServiceServerImpl interface {
    // A normal RPC - one request, one response. The request will be handled by the first available server
    NormalRPC(ctx context.Context, req *MyRequest) (*MyResponse, error)

    // An RPC with a server affinity function for handler selection.
    IntensiveRPC(ctx context.Context, req *MyRequest) (*MyResponse, error)
    IntensiveRPCAffinity(req *MyRequest) float32

    // A multi-rpc - a client will send one request, and receive one response each from every server
    GetStats(ctx context.Context, req *MyRequest) (*MyResponse, error)

    // A streaming RPC - a client opens a stream, the first server to respond accepts it and both send and
    // receive messages until one side closes the stream.
    ExchangeUpdates(stream psrpc.ServerStream[*MyClientMessage, *MyServerMessage]) error

    // An RPC with topics - a client can send one request, and receive one response from each server in one region
    GetRegionStats(ctx context.Context, req *MyRequest) (*MyResponse, error)
}
```

### Server

Finally, a `<ServiceName>Server` will be generated. This is used to start your rpc server, as well as register and deregister topics:

```go
type MyServiceServer interface {
    // An RPC with topics - a client can send one request, and receive one response from each server in one region
    RegisterGetRegionStatsTopic(topic string) error
    DeregisterGetRegionStatsTopic(topic string) error

    // A queue subscription - even if multiple clients are subscribed, only one will receive this update.
    PublishProcessUpdate(ctx context.Context, msg *MyUpdate) error

    // A subscription with topics - every client subscribed to the topic will receive every update.
    PublishUpdateRegionState(ctx context.Context, topic string, msg *MyUpdate) error

    // Close and wait for pending RPCs to complete
    Shutdown()

    // Close immediately, without waiting for pending RPCs
    Kill()
}

// NewMyServiceServer builds a RPCServer that can be used to handle
// requests that are routed to the right method in the provided svc implementation.
func NewMyServiceServer(serverID string, svc MyServiceServerImpl, bus psrpc.MessageBus, opts ...psrpc.ServerOpt) (MyServiceServer, error) {
    ...
}
```

## Affinity

### AffinityFunc

The server can implement an affinity function for the client to decide which instance should take a SingleRequest.
A higher affinity score is better, a score of 0 means the server is not available, and a score < 0 means the server
will not respond to the request.

For example, the following could be used to return an affinity based on cpu load:
```protobuf
rpc IntensiveRPC(MyRequest) returns (MyResponse) {
  option (psrpc.options).type = AFFINITY;
};
```

```go
func (s *MyService) IntensiveRPC(ctx context.Context, req *api.MyRequest) (*api.MyResponse, error) {
    ... // do something CPU intensive
}

func (s *MyService) IntensiveRPCAffinity(_ *MyRequest) float32 {
    return stats.GetIdleCPU()
}
```

### SelectionOpts

On the client side, you can also set server selection options with single RPCs.

```go
type SelectionOpts struct {
    MinimumAffinity      float32       // (default 0) minimum affinity for a server to be considered a valid handler
    MaxiumAffinity       float32       // (default 0) if > 0, any server returning a max score will be selected immediately
    AcceptFirstAvailable bool          // (default true)
    AffinityTimeout      time.Duration // (default 0 (none)) server selection deadline
    ShortCircuitTimeout  time.Duration // (default 0 (none)) deadline imposed after receiving first response
}
```

```go
selectionOpts := psrpc.SelectionOpts{
    MinimumAffinity:      0.5,
    AffinityTimeout:      time.Second,
    ShortCircuitTimeout:  time.Millisecond * 250,
}

res, err := myClient.IntensiveRPC(ctx, req, psrpc.WithSelectionOpts(selectionOpts))
```

In this example, a server will require at least 0.5 idle CPU to be selected for this `IntensiveRPC` request.

## Error handling

PSRPC defines an error type (`psrpc.Error`). This error type can be used to wrap any other error using the `psrpc.NewError` function:

```go
func NewError(code ErrorCode, err error) Error
```

The `code` parameter provides more context about the cause of the error.
A [variety of codes](https://github.com/livekit/psrpc/blob/main/errors.go#L39) are defined for common error conditions.
PSRPC errors are serialized by the PSRPC server implementation, and unmarshalled (with the original error code) on the client.
By retrieving the code using the `Code()` method, the client can determine if the error was caused by a server failure,
or a client error, such as a bad parameter. This can be used as an input to the retry logic, or success rate metrics.

The most appropriate HTTP status code for a given error can be retrieved using the `ToHttp()` method. This status code is generated from the associated error code.
Similarly, a grpc `status.Error` can be created from a `psrpc.Error` using the `ToGrpc()` method.

A `psrpc.Error` can also be converted easily to a `twirp.Error`using the `errors.As` function:

```go
func As(err error, target any) bool
```

For instance:

```go
func convertError(err error) {
	var twErr twirp.Error

	if errors.As(err, &twErr)
		return twErr
	}

	return err
}
```

This allows the twirp server implementations to interpret the `prscp.Errors` as native `twirp.Error`. Particularly, this
means that twirp clients will also receive information about the error cause as `twirp.Code`. This makes sure that
`psrpc.Error` created by psrpc server can be forwarded through PS and twirp RPC all the way to a twirp client error hook
with the full associated context.

`psrpc.Error` implements the `Unwrap()` method, so the original error can be retrieved by users of PSRPC.

## Interceptors

Interceptors allow writing middleware for RPC clients and servers. Interceptors can be used to run code during the call
lifecycle such as logging, recording metrics, tracing, and retrying calls. PSRPC defines four interceptor types which
allow intercepting requests on the client and server.

### ServerRPCInterceptor

`ServerRPCInterceptor` are invoked by the server for calls to unary and multi RPCs.

```go
type ServerRPCInterceptor func(ctx context.Context, req proto.Message, info RPCInfo, handler ServerRPCHandler) (proto.Message, error)

type ServerRPCHandler func(context.Context, proto.Message) (proto.Message, error)
```

The `info` parameter contains metadata about the method including the name and topic. Calling the `handler` parameter
hands off execution to the next interceptor.

`ServerRPCInterceptor` are added to new servers with `WithServerRPCInterceptors`.

Interceptors run in the order they are added so the first interceptor passed to `WithServerRPCInterceptors` is the first
to receive a new requests. Calling the `handler` parameter invokes the second interceptor and so on until the service
implementation receives the request and produces a response.

### ClientRPCInterceptor

`ClientRPCHandler` are created by clients to process requests to unary RPCs.

```go
type ClientRPCInterceptor func(info RPCInfo, handler ClientRPCHandler) ClientRPCHandler

type ClientRPCHandler func(ctx context.Context, req proto.Message, opts ...RequestOption) (proto.Message, error)
```

`ClientRPCInterceptor` are created by implementing `ClientRPCHandler` and passing the interceptor to new clients
using `WithClientRPCInterceptors`.

The `handler` parameter received by `ClientRPCInterceptor` should be called by the implementation of `ClientRPCHandler`
to continue the call lifecycle.

### ClientMultiRPCInterceptor

`ClientMultiRPCHandler` are created by clients to process requests to multi RPCs. Because `ClientMultiRPCHandler`
process several responses for the same request, implementations must define separate functions for each phase of the call
lifecycle. The `Send` function is executed on outgoing request parameters. The `Recv` function is executed once for each
response when it returns from a servers. `Close` is called when the deadline is reached.

```go
type ClientMultiRPCInterceptor func(info RPCInfo, handler ClientMultiRPCHandler) ClientMultiRPCHandler

type ClientMultiRPCHandler interface {
    Send(ctx context.Context, msg proto.Message, opts ...RequestOption) error
    Recv(msg proto.Message, err error)
    Close()
}
```

`ClientMultiRPCInterceptor` are created by implementing `ClientMultiRPCHandler` and passing the interceptor to new
clients using `WithClientMultiRPCInterceptors`.

Each function in a `ClientMultiRPCInterceptor` should call the corresponding function in the handler received in
the `handler` parameter.

### StreamInterceptor

`StreamInterceptor` are created by both clients and servers to process streaming RPCs. The `Send` function is executed
once for each outgoing message. The `Recv` function is executed once for each incoming message. `Close` is called when
either the local or remote host close the stream or if the stream receives a malformed message.

```go
type StreamInterceptor func(info RPCInfo, handler StreamHandler) StreamHandler

type StreamHandler interface {
    Recv(msg proto.Message) error
    Send(msg proto.Message, opts ...StreamOption) error
    Close(cause error) error
}
```

`StreamInterceptor` are created by implementing `StreamHandler` and passing the interceptor to new clients or
servers using `WithClientStreamInterceptors` and `WithServerStreamInterceptors`.

Each function in a `StreamInterceptor` should call the corresponding function in the handler
received in the `handler` parameter.
