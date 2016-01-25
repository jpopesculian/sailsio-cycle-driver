var Rx = require('rx');

function makeSailsIODriver(url) {
    configureIO(window.io, url)
    return {
        http: httpDriver,
        socket: socketDriver
    }
}

function httpDriver(request$) {
    return request$.map(createHttpResponse$);
}

function createHttpResponse$(request) {
    var responses = [];
    var onResponse = function() {};
    var response$ = Rx.Observable.create(function(observer) {
        onResponse = function(response) {
            if (response.jwr.statusCode != 200) {
                observer.onError(response);
            } else {
                observer.onNext(response);
                observer.onCompleted();
            }
        }
        if (responses.length > 0) {
            onResponse(responses[0]);
            onResponse = function() {};
        }
    });
    io.socket.request(request, function(data, jwr) {
        var response = { data: data, jwr: jwr };
        onResponse(response);
        responses.push(response);
    })
}

function socketDriver(event$) {
    return events$.subscribe(function(event) { console.log(event); });
}

function configureIO(io, url) {
  if (io === undefined) {
    throw "sails.io.js must be loaded!"
  }
  if (typeof url === "string") {
      io.sails.url = url;
  }
  io.sails.url = "http://localhost:1337";
}

module.exports = makeSailsIODriver;

