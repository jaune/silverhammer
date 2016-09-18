const eachLimit = require('async/eachLimit');

function requestJSON(path) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function (event) {
      if ((xhr.readyState === XMLHttpRequest.DONE) && (xhr.status === 200)) {
        var data;

        try {
          data = JSON.parse(xhr.responseText);
        } catch (error) {
        }
        return resolve(data);
      }
    }, false);

    // TODO
    // xhr.addEventListener('progress', function (event) {
    //   if (event.lengthComputable) {
    //     console.log(event.loaded / event.total);
    //   }
    // }, false);

    xhr.open('GET', path);
    xhr.send();
  });
}



module.exports = function (store) {
  const isClientSide = !!store;

  var record;
  var isRecording = false;
  var timeout;

  function handleRecord(record) {
    store.dispatch({ type: 'fetcher/BEGIN' });

    record = record.reduce(function (result, value) {
      if (Array.isArray(value)) {
        return result.concat(value);
      }
      result.push(value);

      return result;
    }, []);

    eachLimit(record, 5,
      function loop(pattern, done) {
        if (pattern === 'collections.passport.*') {
          requestJSON('/passport/').then(function (items) {
            store.dispatch({
              type: 'fetcher/RECEIVE',
              pattern: 'collections.passport.*',
              items: items
            });
            done();
          });
        } else {
          done();
        }
      },
      function done(error) {
        if (error) {
          throw error;
        }
        store.dispatch({ type: 'fetcher/END' });
      }
    );
  }


  return {
    isClientSide: isClientSide,
    fetch: function (options) {
      if (isRecording) {
        if (isClientSide) {
          record.push(options);
          if (!timeout) {
            timeout = window.setTimeout(function () {
              handleRecord(record);
              window.clearTimeout(timeout);
              timeout = undefined;
            }, 0);
          }
        } else {
          record.push(options);
        }
      }
    },

    startRecord: function () {
      isRecording = true;
      record = [];
    },
    stopRecord: function () {
      isRecording = false;
      return record;
    }
  };
};