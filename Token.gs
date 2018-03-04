"use strict"

var TOKEN_LIB = (function ( service, default_timeout ) {
  
  // default_timeout min 1 max 21600
  function TOKEN_LIB ( service, default_timeout ) {
    
    
    
    this.service_ = service;
        
    
    this.getScope_ = function ( scope ) {
      
      return ( _.isUndefined( scope ) ) ? "all" : scope;
    
    }
    
    
    this.default_timeout_ = default_timeout
    
    
    this.timeout_ = function (timeout) {
      
      switch ( timeout ) {
        case 'undefined':
          return this.default_timeout_;
        case 'min':
          return 1;
        case 'max':
          return 21600;
        case 'default':
          return 600;
        default:
          return timeout;
      }
    
    };
    
    
    this.cache_ = CacheService.getUserCache();
        
    
  };
  
  
  TOKEN_LIB.prototype.put = function( scope, value, timeout, refresh_value, refresh_timeout ) {
    
    var self = this,  scope = self.getScope_ ( scope );
    
    var token = self.putToken( scope, value, timeout );
    
    var refresh = self.putRefresh( scope, refresh_value, refresh_timeout );
                        
    return { token : token, refresh: refresh_value };
    
  };
  
  
  TOKEN_LIB.prototype.get = function ( scope ) {
    
    var self = this,  scope = self.getScope_ ( scope );
    
    var token = self.getToken( scope );
    
    var refresh = self.getRefresh( scope );
                        
    return { token : token, refresh: refresh };
    
  };
  
  
  TOKEN_LIB.prototype.remove = function ( scope ) {
    
    var self = this,  scope = self.getScope_ ( scope );
    
    var token = self.getToken( scope );
    
    var refresh = self.getRefresh( scope );
                        
    return { token : token, refresh: refresh };
    
  };
  
  
  TOKEN_LIB.prototype.putToken = function( scope, value, timeout ) {
    
    var self = this,  scope = self.getScope_ ( scope );
                        
    return self.cache_.put ( self.service_ + "/token/" + scope, value, self.timeout_(timeout) );
    
  };
  
  
  TOKEN_LIB.prototype.getToken = function ( scope ) {
        
    var self = this, scope = self.getScope_ ( scope );
    
    return self.cache_.get ( self.service_ + "/token/" + scope );

  };
  
  
  TOKEN_LIB.prototype.removeToken = function ( scope ) {
    
    var self = this, scope = self.getScope_ (scope);
        
    return this.cache_.remove ( self.service_ + "/token/" + scope );
    
  };
  
    TOKEN_LIB.prototype.putRefresh = function( scope, value, timeout ) {
    
    var self = this,  scope = self.getScope_ ( scope );
                        
    return self.cache_.put ( self.service_ + "/refresh_token/" + scope, value, self.timeout_(timeout) );
    
  };
  
  
  TOKEN_LIB.prototype.getRefresh = function ( scope ) {
        
    var self = this, scope = self.getScope_ ( scope );
    
    return self.cache_.get ( self.service_ + "/refresh_token/" + scope );

  };
  
  
  TOKEN_LIB.prototype.removeRefresh = function ( scope ) {
    
    var self = this, scope = self.getScope_ (scope);
        
    return this.cache_.remove ( self.service_ + "/refresh_token/" + scope );
    
  };
 

  return TOKEN_LIB;
  

}());


/**
 * Cache the token and refresh_token for given time under a service name.
 *
 * @param {"Spectrocoin"}  service  Api service provider name.
 * @param {"money"}  scope  OPTIONAL Scope of the token for services with several scopes (default is "all").
 * @param {"abcdefghilm12345"}  value  Token to cache.
 * @param {1800}  timeout  OPTIONAL "min", "max", "default" or seconds. min = 1, max = 21600, default = 600
 * @param {"refreshabcdferr1"}  refresh_value  Refresh token to cache.
 * @param {1800}  refresh_timeout  OPTIONAL "min", "max", "default" or seconds. min = 1, max = 21600, default = 600
 * @returns                        return an object with cahced token and refresh token.
 * @customfunction
 */
function TOKEN_PUT ( service, scope, value, timeout, refresh_value, refresh_timeout ) {
 var t = new TOKEN_LIB( service );
 return t.put ( scope, value, timeout, refresh_value, refresh_timeout );
}

/**
 * Get the cached token and refresh_token or null if missing.
 *
 * @param {"Spectrocoin"}  service  Api service provider name.
 * @param {"currency_exchange"}  scope  OPTIONAL Scope of the token for services with several scopes (default is "all").
 * @returns                        return an object with cached token and refresh token.
 * @customfunction
 */
function TOKEN_GET ( service, scope ) {
 var t = new TOKEN_LIB( service );
 return t.get ( scope);
}

/**
 * Delete the cached token and refresh_token.
 *
 * @param {"Spectrocoin"}  service  Api service provider name.
 * @param {"currency_exchange"}  scope  OPTIONAL Scope of the token for services with several scopes (default is "all").
 * @returns                        return an object with null token and refresh token values.
 * @customfunction
 */
function TOKEN_REMOVE ( service, scope ) {
 var t = new TOKEN_LIB( service );
 return t.remove ( scope );
}

/**
 * Cache the token for given time under a service name.
 *
 * @param {"spectrocoin"}  service  Api service provider name.
 * @param {"currency_exchange"}  scope  OPTIONAL Scope of the token for services with several scopes (default is "all").
 * @param {"abcdefghilm12345"}  value  Token to cache.
 * @param {1800}  timeout  OPTIONAL "min", "max", "default" or seconds. min = 1, max = 21600, default = 600
 * @returns                        return an object with cached token.
 * @customfunction
 */
function TOKEN_PUT_TOKEN ( service, scope, value, timeout ) {
 var t = new TOKEN_LIB( service, timeout );
 return t.putToken ( scope, value, timeout );
}

/**
 * Get the cached token or null if missing.
 *
 * @param {"spectrocoin"}  service  Api service provider name.
 * @param {"currency_exchange"}  scope  OPTIONAL Scope of the token for services with several scopes (default is "all").
 * @returns                        return the cached token or null if missing.
 * @customfunction
 */
function TOKEN_GET_TOKEN ( service, scope ) {
 var t = new TOKEN_LIB( service );
 return t.getToken ( scope);
}

/**
 * Delete the cached token.
 *
 * @param {"spectrocoin"}  service  Api service provider name.
 * @param {"currency_exchange"}  scope  OPTIONAL Scope of the token for services with several scopes (default is "all").
 * @returns                        return null.
 * @customfunction
 */
function TOKEN_REMOVE_TOKEN ( service, scope ) {
 var t = new TOKEN_LIB( service );
 return t.removeToken ( scope );
}

/**
 * Cache the refresh_token for given time under a service name.
 *
 * @param {"spectrocoin"}  service  Api service provider name.
 * @param {"currency_exchange"}  scope  OPTIONAL Scope of the token for services with several scopes (default is "all").
 * @param {"abcdefghilm12345"}  value  refresh_token to cache.
 * @param {1800}  timeout  OPTIONAL "min", "max", "default" or seconds. min = 1, max = 21600, default = 600
 * @returns                        return an object with cached refresh token.
 * @customfunction
 */
function TOKEN_PUT_REFRESH ( service, scope, value, timeout ) {
 var t = new TOKEN_LIB( service, timeout );
 return t.putRefresh ( scope, value, timeout );
}

/**
 * Get the cached refresh_token or null if missing.
 *
 * @param {"spectrocoin"}  service  Api service provider name.
 * @param {"currency_exchange"}  scope  OPTIONAL Scope of the token for services with several scopes (default is "all").
 * @returns                        return the cached refresh_token or null if missing.
 * @customfunction
 */
function TOKEN_GET_REFRESH ( service, scope ) {
 var t = new TOKEN_LIB( service );
 return t.getRefresh ( scope );
}

/**
 * Delete the cached refresh_token.
 *
 * @param {"spectrocoin"}  service  Api service provider name.
 * @param {"currency_exchange"}  scope  OPTIONAL Scope of the token for services with several scopes (default is "all").
 * @returns                        return null.
 * @customfunction
 */
function TOKEN_REMOVE_REFRESH ( service, scope ) {
 var t = new TOKEN_LIB( service );
 return t.removeRefresh ( scope );
}