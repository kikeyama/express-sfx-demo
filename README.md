# Express Demo

gRPC server is implemented in https://github.com/kikeyama/grpc-sfx-demo.

## Prerequisites

Download and place .proto file at `./pb/` from above gRPC server repository.  

```
mkdir pb
wget https://raw.githubusercontent.com/kikeyama/grpc-sfx-demo/master/pb/demo.proto -O ./pb/demo.proto
```

## Env var

ENV_VAR | Description | Default Value
--------|-------------|--------------
`GORILLA_HOST` | Hostname of Gorilla/Mux app | `localhost`
`GORILLA_PORT` | Port number of Gorilla/Mux app | `9090`
`GRPC_HOST` | Hostname of gRPC | `localhost`
`GRPC_PORT` | Port number of gRPC | `50051`
`SIGNALFX_SERVICE_NAME` | Service name at SignalFx trace | `unnamed-nodejs-service`
`SIGNALFX_ENDPOINT_URL` | Endpoint url of SignalFx agent | `http://localhost:9080/v1/trace`

## Endpoints

Endpoint | Description
---------|------------
`/` | Simple response with "hello world" message
`/healthz` | Liveness check
`/api/gorilla/animal` | Request gorilla/mux app at `/api/grpc/animal` with GET
`/api/grpc/animal` | Request gRPC server at `ListAnimals`
