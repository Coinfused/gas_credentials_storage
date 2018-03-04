"use strict"

var APIKEY_LIB = (function ( service, default_scope ) {
  
  
  function APIKEY_LIB ( service, default_scope) {
    
    this.service_ = service;
    
    
    this.default_scope_ = ( _.isUndefined( default_scope ) ) ? "all" : default_scope;
    
    
    this.getScope_ = function ( scope ) {
      
      return ( _.isUndefined( scope ) ) ? this.default_scope_ : scope;
    
    }
    
    
    this.store_ = new STORE_LIB ( "user", "max" );
    
    
    this.keys_ = function () {
      
      var self = this;
      
      return this.store_.getKeys ().filter ( function ( key ) {
      
        return key.split("/")[0] + key.split("/")[1] === self.service_ + "apikey";
      
      }).map ( function ( key ) { return key; });
    
    };
    
    
  };
  
  
  APIKEY_LIB.prototype.put = function( scope, value ) {
    
    var self = this;
        
    if ( _.isUndefined( value ) ) { var value = scope, scope = self.default_scope_ };
            
    return this.store_.put ( self.service_ + "/apikey/" + scope, value );
    
  };
  
  
  APIKEY_LIB.prototype.get = function ( scope ) {
        
    var self = this, scope = self.getScope_ ( scope );
    
    return self.store_.get ( self.service_ + "/apikey/" + scope );

  };
  
  
  APIKEY_LIB.prototype.remove = function ( scope ) {
    
    var self = this, scope = self.getScope_ (scope);
        
    return this.store_.remove ( self.service_ + "/apikey/" + scope );
    
  };
  
  
  APIKEY_LIB.prototype.getAll = function () {
    
    var self = this;
        
    return self.store_.getMany ( self.keys_() );
    
  };
  
  
  APIKEY_LIB.prototype.removeAll = function () {
    
    var self = this;
    
    return self.store_.removeMany ( self.keys_() );
    
  };
  

  return APIKEY_LIB;
  

}());


/**
 * Save the apikey for the given service and scope, under user properties and cache.
 *
 * @param {"coinapi"}  service  Api service provider name.
 * @param {"string"}  scope  OPTIONAL Scope of the apikey (for services with several scopes. Default is "all").
 * @param {"keyvalue"}  value  Apikey to store.
 * @returns                        return the saved apikey.
 * @customfunction
 */
function APIKEY_PUT ( service, scope, value ) {
  var a = new APIKEY_LIB ( service );
  return a.put ( scope, value )
}

/**
 * Get the apikey for the given service and scope from cache.
 * If it's missing in the cache, it get it from the user properties, cache it and return it.
 * If missing also in user properties, it returns null.
 *
 * @param {"coinapi"}  service  Api service provider name.
 * @param {"all"}  scope  OPTIONAL Scope of the apikey (for services with several scopes. Default is "all").
 * @returns                        return the apikey or null if missing.
 * @customfunction
 */
function APIKEY_GET ( service, scope ) {
  var a = new APIKEY_LIB ( service );
  return a.get ( scope )
}

/**
 * Remove the apikey for the given service and scope from cache and user properties.
 *
 * @param {"coinapi"}  service  Api service provider name.
 * @param {"all"}  scope  OPTIONAL Scope of the apikey (for services with several scopes. Default is "all").
 * @returns                        return null.
 * @customfunction
 */
function APIKEY_REMOVE ( service, scope ) {
  var a = new APIKEY_LIB ( service );
  return a.remove ( scope )
}

/**
 * Get all the apikeys for the given service.
 * If a key it's in user properties but not cached, it cache it.
 *
 * @param {"coinapi"}  service  Api service provider name.
 * @returns                        return an object with scopes and apikeys.
 * @customfunction
 */
function APIKEY_GETALL ( service ) {
  var a = new APIKEY_LIB ( service );
  return a.getAll ( )
}

/**
 * Remove all the apikeys for the given service from cache and user properties.
 *
 * @param {"coinapi"}  service  Api service provider name.
 * @returns                        return null.
 * @customfunction
 */
function APIKEY_REMOVEALL ( service ) {
  var a = new APIKEY_LIB ( service );
  return a.removeAll ( )
}
