const whiteSuggar = window.whiteSuggar || {};

whiteSuggar.url = whiteSuggar.url || {};

/**
 * convert query string to name value pairs. {name:Xxx, value:Yyy}
 * @returns {Array}
 */
whiteSuggar.url.querySerialize = function() {
    let _vals = [];
    const _hash = window.location.search.slice(1).split('&');
    const _max = _hash.length;

    if(_max === 1 && _hash[0]=== '') return null;

    let _ary = [];
    let _col =[];
    for(let i=0; i<_max; i++){
        _ary = [];
        _col = _hash[i].split('=');
        _ary.push('name');
        _ary.push('value');
        _ary['name'] = _col[0];
        _ary['value'] = decodeURIComponent(_col[1]);
        _vals.push(_ary);
    }

    return _vals;
};

/**
 * replace url part of search and hash
 * @param {string} search 
 * @param {string} hash 
 */
whiteSuggar.url.replaceUrl = function(search, hash){

    let _url = window.location.href;
    _url = _url.replace(window.location.search, '');
    _url = _url.replace(window.location.hash, '');

    if(search !== null)
        _url = `${_url}?${search}`;
    if(hash !== null)
        _url = `${_url}#${hash}`;

    window.history.replaceState(null, null, _url)
};

/**
 * convert dictionary to query string
 * @param {Array} array 
 * @returns {string}
 */
whiteSuggar.url.convertSearchString = function(array){

    let _search = '';

    const _keys = Object.keys(array);

    for(let i=0; i<_keys.length; i++){
        _search = `${_search}&${_keys[i]}=${query[_keys[i]]}`;
    }

    return _search.substring(1);
};

/**
 * convert formData to query string
 * @param {FormData} formData 
 */
whiteSuggar.url.convertSearchString = function(formData){
    
    let _search = '';

    const _keys = formData.keys();

    for(let i=0; i<_keys.length; i++){
        _search = `${_search}&${_keys[i]}=${query[_keys[i]]}`;
    }

    return _search.substring(1);
};
