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

const packageObject = grpc.loadPackageDefinition(packageDefinition).pb;

const target = grpcHost + ':' + grpcPort;

logger.info('Initialize gRPC client for AnimalService for ' + target);
const client = new packageObject.AnimalService(target, grpc.credentials.createInsecure());

//module.exports.listAnimals = function() {
////  var animals;
//
//  client.listAnimals({}, (err, response) => {
//    logger.info('Request ListAnimals via gRPC');
//    //console.log(response.animals);
//    return response.animals;  // undefined
////    animals = response.animals;
//  });
//
////  return animals;  // undefined
//};

module.exports = client;