"use strict";

var _ = lodash.load();

var STORE_LIB = ( function ( space, timeout ) {
  
  function STORE_LIB ( space, timeout ) {
    
      
    this.space_ = space;
    
        
    this.props_ = function() {

      switch ( _.toLower ( this.space_ ) ) {
        case 'user':
          return PropertiesService.getUserProperties();
          break;
        case 'script':
          return PropertiesService.getScriptProperties();
          break;
        case 'document':
          return PropertiesService.getDocumentProperties();
          break;
        default:
          throw "First argument must be 'user', 'script' or 'document'";
      };
        
    };
    
    
    this.cache_ = function () {
      
      switch ( _.toLower ( this.space_ ) ) {
        case 'user':
          return CacheService.getUserCache();
          break;
        case 'script':
          return CacheService.getScriptCache();
          break;
        case 'document':
          return CacheService.getDocumentCache();
          break;
        default:
          throw "First argument must be 'user', 'script' or 'document'";
      };
      
    };
    
    
    this.temp_ = timeout;
    
    
    this.timeout_ = function () {
      
      switch ( this.temp_ ) {
        case 'min':
          return 1;
        case 'max':
          return 21600;
        case 'default':
          return 600;
        default:
          return this.temp_;
      }
    
    };
    
        
  };
  
  
  STORE_LIB.prototype.put = function ( key, arg ) {

    if (_.isArray( arg ) && _.isArray( key ) ) return this.putMany ( key, arg )
    else if (  _.isString(arg) || _.isObject (arg) ) return this.putOne ( key, arg )
    else throw "Can't read the arguments";
    
  };
  
  
  STORE_LIB.prototype.putOne = function ( key, value ) {

    // Stringify the value if is an object.
    var self = this, value = ( _.isObject( value ) ) ? JSON.stringify ( value ) : value;
    
    // Cache and save in prop the key/value pair.
    var cache =  self.cache_().put ( key, value, self.timeout_ () );
    
    var prop = self.props_().setProperty ( key, value );
    
    return self.cache_().get ( key );
    
  };
  
  
  STORE_LIB.prototype.putMany = function ( keys, values ) {

    var self = this;
    
    // For  each value, stringify if it is an object and save in prop and cache.
    var values = values.map ( function ( value, index ) {
      
      var value = ( _.isObject( value ) ) ? JSON.stringify ( value ) : value;
      
      var cache = self.cache_().put ( keys[index], value, self.timeout_ () );
      
      var prop = self.props_().setProperty ( keys[index], value );
      
    });
      
    return self.cache_ ( ).getAll ( keys );
      
  };
  
  
  STORE_LIB.prototype.get = function ( key ) {
        
    if (_.isArray( key ) ) return this.getMany ( key )
    
    else if ( _.isString( key )) return this.getOne ( key )
    
    else throw "Can't read the arguments";
    
  };
  
  
  STORE_LIB.prototype.getOne = function ( key ) {
    
    // Retrive the key/value from the cache.
    var self = this, value = self.cache_().get ( key );
    
    // In key/value in not cached, get from props and cache.
    if ( _.isNull( value ) ) {
      
      var value = self.props_().getProperty ( key );
      
      self.cache_().put ( key, value, self.timeout_() );
      
    }
    
    // return the value, as object if stringified object or string.
    return ( _.isObject( value ) ) ? JSON.parse ( value ) : value;
    
  };
  
  
  STORE_LIB.prototype.getMany = function ( keys ) {
        
    // Retrive all the cached key-value pairs.
    var self = this, values = self.cache_().getAll ( keys );
    
    // Look on prop for non cached key-value pairs and cache, skipping null/not stored values.
    Object.keys ( keys ).filter ( function ( key ) {
      
      return values[key] === null;
      
    }).map ( function ( key ) {
      
      values[key] = self.props_().getProperty ( key )
      
      if ( values[key] !== null ) self.cache_().put ( key, values[key], self.timeout_() );
      
    });
    
    // Return all the pairs as object including null value {key0:value0,key1:null, ...}
    return values;
    
  };
  
  
  STORE_LIB.prototype.remove = function ( key ) {
        
    if (_.isArray( key ) ) return this.removeMany ( key )
    
    else if ( _.isString( key )) return this.removeOne ( key )
    
    else throw "Can't read the arguments";
    
  };
  

  STORE_LIB.prototype.removeOne = function (key) {
    
    this.cache_().remove ( key );
    
    this.props_().deleteProperty ( key );
    
    return;

  };
  
  
  STORE_LIB.prototype.removeMany = function (keys) {
    
    var self = this;
    
    // Remove all cached key-value pairs in the keys list at once.
    self.cache_().removeAll ( keys );
    
    // Remove each key-value pair i nthe keys list.
    keys.map ( function ( key ) {
      var prop = self.props_().deleteProperty ( key );
    });
              
    return;
    
  };
  
  
  STORE_LIB.prototype.removeAll = function () {
        
    // Get all the stored keys.
    var keys = this.props_().getKeys();
    
    // Remove all the stored key from cache.
    this.cache_().removeAll ( keys );
    
    // Remove all stored keys.
    this.props_().deleteAllProperties()
              
    return;
    
  };
  
  
  STORE_LIB.prototype.getKeys = function () {

    return this.props_().getKeys();
    
  };

              
  return STORE_LIB;
  

}());



/**
 * Save a key/value pair or array of keys and array of values in the given space and cached for the given seconds.
 *
 * @param {"script"}  space  Cache and properties space: "user", "script" or "document".
 * @param {1800}  timeout  "min", "max", "default" or seconds. min = 1, max = 21600, default = 600
 * @param {"foo"}  keys  Keys to store. Array of keys, or key string.
 * @param {"bar"}  values  Values to store. Array of values, or kvalueey string.
 * @returns                        return the saved/cached pair(s).
 * @customfunction
 */
function STORE_PUT ( space, timeout, keys, values ) {
  var s = new STORE_LIB ( space, timeout );
  return s.put ( keys, values )
}

/**
 * Get a value or array of values in the given space.
 * If the value is not cached, it retrive it from the space properties, cahce it and return.
 * If missing also in space properies it returns null value.
 *
 * @param {"script"}  space  Cache and properties space: "user", "script" or "document".
 * @param {"foo"}  keys  Keys to store. Array of keys, or key string.
 * @returns                        return the saved/cached pair(s).
 * @customfunction
 */
function STORE_GET ( space, keys ) {
  var s = new STORE_LIB ( space );
  return s.get ( keys )
}

/**
 * Remove the key/value pair or pairs from cache and space properties.
 *
 * @param {"script"}  space  Cache and properties space: "user", "script" or "document".
 * @param {"foo"}  keys  Keys to store. Array of keys, or key string.
 * @returns                        return null.
 * @customfunction
 */
function APIKEY_REMOVE ( scope, keys ) {
  var a = new APIKEY_LIB ( scope );
  return a.remove ( keys )
}

/**
 * Get all the key/value pairs in the given space.
 * If a value is not cached, it cache it.
 *
 * @param {"script"}  space  Cache and properties space: "user", "script" or "document".
 * @returns                        return the saved/cached pairs.
 * @customfunction
 */
function APIKEY_GETALL ( space ) {
  var a = new APIKEY_LIB ( space );
  return a.getAll ( )
}

/**
 * Remove all the key/value pairs in the given space, from space properties and cache.
 *
 * @param {"script"}  space  Cache and properties space: "user", "script" or "document".
 * @returns                        return null.
 * @customfunction
 */
function APIKEY_REMOVEALL ( space ) {
  var a = new APIKEY_LIB ( space );
  return a.removeAll ( )
}
