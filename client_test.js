const PROTO_PATH = __dirname + '/pb/demo.proto';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const logger = require('./logger');

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
}

const grpcHost = process.env.GRPC_HOST || 'localhost'
const grpcPort = process.env.GRPC_PORT || 50051

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

var packageObject = grpc.loadPackageDefinition(packageDefinition).pb;

function main() {
  var target = grpcHost + ':' + grpcPort;

  var client = new packageObject.AnimalService(target, grpc.credentials.createInsecure());
  client.listAnimals({}, function(err, response) {
    logger.info('Request ListAnimals via gRPC');
    console.log(response.animals);
  });
}

main();

/*
protoLoader.load(PROTO_PATH, options).then(packageDefinition => {
  const packageObject = grpc.loadPackageDefinition(packageDefinition);
  var client = new packageObject.AnimalService(target, grpc.credentials.createInsecure());

  client.listAnimals({}, function(err, response) {
    console.log('grpc list');
  });
});
*/
