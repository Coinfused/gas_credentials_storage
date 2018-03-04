# gas-credentials-storage

Google Apps Script Library that handles:

- HMAC key-secret pairs (cache and properties. User)
- Simple API keys (cache and properties. User)
- Tokens (cache only. User)
- Generic store (cache and properties. User, script or document)

The cache is used to speed up the get and getAll methods.

## Dependencies:

- Lodashgs https://github.com/oshliaer/lodashgs

## Usage:

Resources > Libraries > Add Library : MLU703dX80-Qem14M6Z5pdQNf7b5On9ZT
or copy the .gs files in your project. 


## Documentation:

Can be used as simple functions or objects and methods.

- For simple custom functions, see documentation here: https://script.google.com/macros/library/d/1lMI49ZEAkjhcX2cN_yxnVr8F4J-Si6aXCKe0NntGA4qyJAMKLXyQjM_e/GS:api

- For objects and methods see following examples or Test.gs file.

```javascript
  // If used as a library, repleace with:
  // var hmac = new LIBRARY_IDENTIFIER.HMAC_LIB("hmac")
  var hmac = new HMAC_LIB("hmac");
  
  hmac.put("scope","key","secret");
  hmac.put("key","secret");
  
  Logger.log(hmac.get("scope"));
  Logger.log(hmac.get()); 
  Logger.log(hmac.getAll());
  
  hmac.remove("scope");
  hmac.remove();
  hmac.removeAll();
  
  
  // If used as a library, repleace with:
  // var apikey = new LIBRARY_IDENTIFIER.APIKEY_LIB("hmac")
  var apikey = new APIKEY_LIB("apikey");
  
  apikey.put("scope","key");
  apikey.put("key");
  
  Logger.log(apikey.get("scope"));
  Logger.log(apikey.get()); 
  Logger.log(apikey.getAll());
  
  apikey.remove("scope");
  apikey.remove();
  apikey.removeAll();
  
  
  // If used as a library, repleace with:
  // var store = new LIBRARY_IDENTIFIER.STORE_LIB("hmac")
  var store = new STORE_LIB("generic_store");
  
  store.put("key","value", "max");
  store.put(["key1","key2"], ["value1", {a:1,b:2}],100);
  
  Logger.log(store.get("key"));
  Logger.log(store.get(["key1", "key2"])); 
  Logger.log(store.getAll());
  
  store.remove("key");
  store.remove(["key1", "key2"]); 
  store.removeAll();
  
  
  // If used as a library, repleace with:
  // var token = new LIBRARY_IDENTIFIER.TOKEN_LIB("hmac")
  var token = new TOKEN_LIB("token", 1800);
  
  token.putToken("user_account", "userxxxxxxxxx", 1000);
  token.putRefresh("user_account", "userxxxxxxxxx", 1000);
  
  token.put("currency_exchange", "token", "refresh_token", 3);
  
  Logger.log(token.getToken("user_account"));
  Logger.log(token.getRefresh("currency_exchange"));
  
  Utilities.sleep(5000)
  Logger.log(token.get("currency_exchange"));
  token.remove("user_account");
```


## License:

https://github.com/Coinfused/gas_credentials_storage/blob/master/LICENSE.md
