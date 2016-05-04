define('dispatcher', function(require) {
    var stack = {};
    var register = function(eventName, callback, once) {
        if(!stack[eventName]) {
            stack[eventName] = [];
        }
        stack[eventName].push({callback: callback, once: once});
    };

    return {
        on: function(eventName, callback) {
            register(eventName, callback, false);

        },
        once: function(eventName, callback) {
            register(eventName, callback, true);

        },
        off: function(eventName, callback) {
            if(stack[eventName]) {
                for(var i = 0; i < stack[eventName].length; i++) {
                    if(stack[eventName][i].callback === callback) {
                        stack[eventName].splice(i, 1);
                        i--; // When removed, i will be another another object
                    }
                }
            }
        },
        trigger: function(eventName) {
            if(stack[eventName]) {
                for(var i = 0; i < stack[eventName].length; i++) {
                    try{
                        var callback = stack[eventName][i].callback;
                        if(stack[eventName][i].once) { // Removal has to be done before callback is called, in case it registers something
                            this.off(eventName, stack[eventName][i].callback);
                            i--; // When removed, i will be another another object
                        }
                        callback.apply(this, arguments);
                    } catch(err) {
                        console.error(err);
                    }
                }
            }
        }
    };
});
