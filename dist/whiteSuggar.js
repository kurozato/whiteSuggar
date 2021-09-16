

//name space
const whiteSuggar = window.whiteSuggar || {};

(function(root){
    
    //whiteSuggar.url

    root.url = root.url || {};
    (function(_){
        //local
        const serialize = function(search){
            let _vals = [];
            const _hash = search.slice(1).split('&');
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
         * 
         * @param {string[]} keys 
         * @param {Function} getValue 
         */
        const getSearchString = function(keys, getValue){
            let _search = '';
        
            for(let i=0; i<keys.length; i++){
                _search = `${_search}&${keys[i]}=${getValue(keys[i])}`;
            }

            return _search.substring(1);
        };

        //Public

        /**
         * convert query string to name value pairs. {name:Xxx, value:Yyy}
         * @returns {Array}
         */
        _.querySerialize = function() {
            return serialize(window.location.search);
        };

        /**
         * convert hash string to name value pairs. {name:Xxx, value:Yyy}
         * @param {string} mark #mark
         * @param {string} hash #mark?key1=value1&key2=value2
         * @returns {Array}
         */
        _.userCustomSerialize = function(mark, hash) {
            const _search = hash.replace(mark, '');
            return serialize(_search);
        }

        /**
         * convert dictionary to query string
         * @param {Array} array 
         * @returns {string}
         */
        _.convertSearchString = function(array){
            const _keys = Object.keys(array);
            return getSearchString(_keys, (key) => {return array[key]});
        };

        /**
         * convert formData to query string
         * @param {FormData} formData 
         */
        _.convertSearchString = function(formData){
            const _keys = formData.keys();
            return getSearchString(_keys, (key) => {return formData[key]});
        };

    })(root.url);


    //whiteSuggar.filtering

    root.filtering = root.filtering || {};
    (function(_){
        /**
         * 
         * @param {HTMLElement} element 
         * @param {string} elementName 
         * @param {Function} expression 
         */
        _.filter = function(element, elementName, expression){
            const targets = element.getElementsByTagName(elementName);
            for(let i = 0; i < targets.length; i++){
                if(expression(targets[i]) === true){
                    targets[i].style.display = '';
                }
                else{
                    targets[i].style.display = 'none';
                }
            }
        };

        /**
         * return row content contain 'key'.
         * @param {string} key -  key
         * @param {HTMLElement} element - target
         * @returns {boolean}
         */
        _.likeMatch = function (key, element) {
            return element.innerText.indexOf(key) > -1;
        };

        /**
         * return row content equal 'key'.
         * @param {string} key -  key
         * @param {HTMLElement} element - target
         * @returns {boolean}
         */
        _.match = function (key, element) {
            return element.innerText === key;
        };
    })(root.filtering); 

})(whiteSuggar);






