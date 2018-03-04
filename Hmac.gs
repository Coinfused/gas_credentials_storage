"use strict"

var HMAC_LIB = (function ( service, default_scope ) {
  
  function HMAC_LIB ( service, default_scope ) {
    
  
    this.service_ = service;
    
    
    this.default_scope_ = ( _.isUndefined( default_scope ) ) ? "all" : default_scope;
    
    
    this.getScope_ = function ( scope ) {
      
      return ( _.isUndefined( scope ) ) ? this.default_scope_ : scope;
    
    }
    
    
    this.store_ = new STORE_LIB ( "user", "max" );
    
    
    this.keys_ = function () {
      
      var self = this;
      
      return this.store_.getKeys ().filter ( function ( key ) {
      
        return key.split("/")[0] + key.split("/")[1] === self.service_ + "hmac";
      
      }).map ( function ( key ) { return key; });
    
    };
    
    
  };
  
  
  HMAC_LIB.prototype.put = function( scope, key, secret ) {
    
    var self = this, args = Array.prototype.slice.call( arguments );
    
    if ( args.length === 2 ) { var secret = key, key = scope, scope = self.default_scope_ };
    
    if ( args.length < 2 ) { throw "key or secret is missing" };
    
    return self.store_.put ( self.service_ + "/hmac/" + scope, { key : key , secret : secret } );
    
  };
  
  
  HMAC_LIB.prototype.get = function ( scope ) {
    
    var self = this, scope = self.getScope_ ( scope );
    
    var value = this.store_.get ( self.service_ + "/hmac/" + scope )
        
    return ( _.isString( JSON.parse(value) ) ) ? value : JSON.parse( value );

  };
  
  
  HMAC_LIB.prototype.getkey = function ( scope ) {
    
    var key = this.get( scope )["key"];
    
    if ( _.isNull( key ) ) throw "Key is missing"
    
    else return key;

  };
  
  
  HMAC_LIB.prototype.getSecret = function ( scope ) {
    
    var secret = this.get( scope )["secret"];
    
    if ( _.isNull( secret ) ) throw "Secret is missing"
    else return secret;

  };
   
  
  HMAC_LIB.prototype.remove = function ( scope ) {
    
    var self = this, scope = self.getScope_ (scope);
        
    return self.store_.remove ( self.service_ + "/hmac/" + scope );
    
  };
  
  
  HMAC_LIB.prototype.getAll = function () {
    
    var self = this;
    
    return self.store_.getMany ( self.keys_() );
    
  };
  
  
  HMAC_LIB.prototype.removeAll = function () {
    
    var self = this;
    
    return self.store_.removeMany ( self.keys_() );
    
  };
  
 
  return HMAC_LIB
  

}());



/**
 * Save the HMAC key and secret under user properties and cache, for the given service and scope.
 *
 * @param {"localbitcoins"}  service  Api service provider name.
 * @param {"money_pin"}  scope  OPTIONAL Scope of the apikey (for services with several scopes. Default is "all").
 * @param {"key1"}  key  Key to store.
 * @param {"secret1"}  secret  Secret to store.
 * @returns                        Return an onject with key and secret: {key: key1, secret: secret1 }.
 * @customfunction
 */
function HMAC_PUT ( service, scope, key, secret ) {
  var h = new HMAC_LIB ( service );
  return h.put ( scope, key, secret )
}

/**
 * Get the key and secret for the given service and scope from cache.
 * If it's missing in the cache, it get it from the user properties, cache it and return it.
 * If missing also in user properties, it returns null.
 *
 * @param {"localbitcoins"}  service  Api service provider name.
 * @param {"money_pin"}  scope  OPTIONAL Scope of the apikey (for services with several scopes. Default is "all").
 * @returns                        Return an onject with key and secret: {key: key1, secret: secret1 }.
 * @customfunction
 */
function HMAC_GET ( service, scope ) {
  var h = new HMAC_LIB ( service );
  return h.get ( scope )
}

/**
 * Get the key for the given service and scope from cache.
 * If it's missing in the cache, it get it from the user properties, cache it and return it.
 * If missing also in user properties, it returns null.
 *
 * @param {"localbitcoins"}  service  Api service provider name.
 * @param {"money_pin"}  scope  OPTIONAL Scope of the apikey (for services with several scopes. Default is "all").
 * @returns                        Return the key for the given scope.
 * @customfunction
 */
function HMAC_GETKEY ( service, scope ) {
  var h = new HMAC_LIB ( service );
  return h.getKey ( scope )
}

/**
 * Get the secret for the given service and scope from cache.
 * If it's missing in the cache, it get it from the user properties, cache it and return it.
 * If missing also in user properties, it returns null.
 *
 * @param {"localbitcoins"}  service  Api service provider name.
 * @param {"money_pin"}  scope  OPTIONAL Scope of the apikey (for services with several scopes. Default is "all").
 * @returns                        Return the secret for the given scope.
 * @customfunction
 */
function HMAC_GETSECRET ( service, scope ) {
  var h = new HMAC_LIB ( service );
  return h.getSecret ( scope )
}

/**
 * Remove the key and secret for the given service and scope from cache and user properties.
 *
 * @param {"coinapi"}  service  Api service provider name.
 * @param {"all"}  scope  OPTIONAL Scope of the apikey (for services with several scopes. Default is "all").
 * @returns                        return null.
 * @customfunction
 */
function HMAC_REMOVE ( service, scope ) {
  var h = new HMAC_LIB ( service );
  return h.remove ( scope )
}

/**
 * Get all the keys and secrets for the given service from user properties.
 * If they are missing in the cache, they are cached as well.
 *
 * @param {"localbitcoins"}  service  Api service provider name.
 * @returns                        Return an object with scopes, key and secret: {scope1: {key: key1, secret: secret1 }}.
 * @customfunction
 */
function HMAC_GETALL ( service ) {
  var h = new HMAC_LIB ( service );
  return h.getAll ( )
}

/**
 * Remove all the keys and secrets for the given service from cache and user properties.
 *
 * @param {"coinapi"}  service  Api service provider name.
 * @returns                        return null.
 * @customfunction
 */
function HMAC_REMOVEALL ( service ) {
  var h = new HMAC_LIB ( service );
  return h.removeAll ( )
}