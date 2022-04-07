//name space
const whiteSuggar = window.whiteSuggar || {};

(function(root){
    
    //whiteSuggar.url

    root.url = root.url || {};
    (function(_){

        //Public

        /**
         * object -> string
         * @param {object} data 
         * @returns {string}
         */
        _.serialize = function(data){
            const _keys = Object.keys(data);
            let _sdata = '';
            
            for(let i=0, l = _keys.length; i < l; i++){
                _sdata = _sdata + `&${encodeURIComponent(_keys[i])}=${encodeURIComponent(data[_keys[i]])}`;
            }

            return _sdata.substring(1);
        }

        /**
         * string -> object
         * @param {string} query 
         * @returns {Object}
         */
        _.deserialize = function(){

            const _url = new URL(window.location.href);
            
            const _obj = {}
            for(const [key, value] of _url.searchParams.entries()){
                _obj[key] = value;
            }
            return _obj;
        };

        /**
         * replace url part of search and hash
         * @param {object} data 
         */
        _.replaceUrl = function(data){
            const _url = new URL(window.location.href);
            const state = {type:'change', method: data.method, src:'whiteSuggar.url.replaceUrl'};
            const unused = '';

            if(data.params !== undefined && data.params !== null && Object.keys(data.params).length > 0)
                _url.search = new URLSearchParams(data.params).toString();

            if(data.hash !== undefined && data.hash !== null && data.hash !== '#')
                _url.hash = data.hash.replace('#', '');
            
            window.history.pushState(state, unused ,_url);
        }

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


    //whiteSuggar.table

    root.table = root.table || {};
    (function(_){
        
        //Local
        
        const NON_OMIT = -1;
        const FL_OMIT = 0;
        const FLM_OMIT = 1;
    
        const DATA_KEY_PAGE_NO = 'page';
        const DATA_KEY_CUR_PAGE = 'currentPage';
        const DATA_KEY_PER_PAGE = 'perPage';
    
       /**
        * 
        * @param {string} id 
        * @param {string} ariaLabel 
        * @param {string} dataPage 
        * @param {boolean} active
        * @param {string} text 
        * @param {HTMLElement} content 
        */
       const addLiElement = function(id, ariaLabel, dataPage, active, text, content){
           const _li = document.createElement('li');
           _li.classList.add('page-item');
           if(active === true)
               _li.classList.add('active');
           _li.id = id;
           _li.setAttribute('style','cursor:pointer;');
   
           const _a = document.createElement('a');
           _a.classList.add('page-link');
           _a.setAttribute('aria-label',ariaLabel);
           _a.setAttribute('data-page',dataPage);
           _a.textContent = text;
   
           _li.append(_a);
   
           content.append(_li);
       };
   
        const buildSimpleElement = function(tagName, id, text){
           const _elem = document.createElement(tagName);
           _elem.id = id;
           _elem.textContent = text;
           return _elem;
       };    
   
        /**
         * 
         * @param {String} tagName 
         * @param {String} id 
         * @param {String} className 
         * @param {String} cssText 
         * @returns {Element}
         */
        const buildelement = function(tagName, id, className, cssText){
            const _elem = document.createElement(tagName);
            _elem.id = id;
            _elem.className = className;
            _elem.style.cssText = cssText;
            return _elem;
        };
    
        /**
         * 
         * @param {Number} max 
         */
        const getOMIT = function(max){
            if(max < 7)
                return NON_OMIT;
            if(10 <= max)
                return FLM_OMIT;
            
            return FL_OMIT;
        };
    
        /**
         * 
         * @param {Number} OMIT 
         * @param {Number} current
         * @param {Number} max
         * @returns {function(Number, Number, HTMLElement, HTMLElement)}
         */
        const pagingFactory = function(OMIT, current, max){
            switch (OMIT) {
                case NON_OMIT:
                    return simplePaging;
                    //break;
                case FL_OMIT:
                    if(current < 5) return firstOmitPaging;
                    else return lastOmitPaging;
                    //break;
                case FLM_OMIT:
                    if(current < 5) return firstOmitPaging;
                    else if(max - 3 <= current) return lastOmitPaging;
                    else return midOmitPaging;
                    //break;      
            }
        };
    
        /**
         * 
         * @param {Number} max 
         * @param {Number} current 
         * @param {HTMLElement} ul 
         * @param {HTMLElement} element 
         */
         const simplePaging = function(max, current, ul, element){
       
           addLiElement(`${element.id}_page-item-f`, 'First', 'f', false, '«', ul);
           addLiElement(`${element.id}_page-item-p`, 'Previous', 'p', false, '<', ul);
   
           for (let i = 1; i <= max; i++) {
               const _i = i.toString();
               addLiElement('page-item-' + _i, '', _i,  i === current, _i, ul);
           }
           
           addLiElement(`${element.id}_page-item-n`, 'Next', 'n', false, '>', ul);
           addLiElement(`${element.id}_page-item-l`, 'Last', 'l', false, '»', ul);
        };
        
        /**
         * 
         * @param {Number} max 
         * @param {Number} current 
         * @param {HTMLElement} ul 
         * @param {HTMLElement} element 
         */
        const firstOmitPaging = function(max, current, ul, element){
           const _max = max.toString();
           
           addLiElement(`${element.id}_page-item-f`, 'First', 'f', false, '«', ul);
           addLiElement(`${element.id}_page-item-p`, 'Previous', 'p', false, '<', ul);
   
           for (let i = 1; i <= 5; i++) {
               const _i = i.toString();
               addLiElement('page-item-' + _i, '', _i,  i === current, _i, ul);
           }
           /*** Omit ***/
           addLiElement(`${element.id}_page-item-o`, 'Omit', 'o', false, '...', ul);
           addLiElement('page-item-' + _max, '', _max,  false, _max, ul);
           /*** Omit ***/
           addLiElement(`${element.id}_page-item-n`, 'Next', 'n', false, '>', ul);
           addLiElement(`${element.id}_page-item-l`, 'Last', 'l', false, '»', ul);
        };
    
        /**
         * 
         * @param {Number} max 
         * @param {Number} current 
         * @param {HTMLElement} ul 
         * @param {HTMLElement} element 
         */
         const lastOmitPaging = function(max, current, ul, element){
          
           addLiElement(`${element.id}_page-item-f`, 'First', 'f', false, '«', ul);
           addLiElement(`${element.id}_page-item-p`, 'Previous', 'p', false, '<', ul);
           /*** Omit ***/
           addLiElement('page-item-' + '1', '', '1',  false, '1', ul);
           addLiElement(`${element.id}_page-item-o`, 'Omit', 'o', false, '...', ul);
           /*** Omit ***/
           for (let i = max - 4; i <= max; i++) {
               const _i = i.toString();
               addLiElement('page-item-' + _i, '', _i,  i === current, _i, ul);
           }
   
           addLiElement(`${element.id}_page-item-n`, 'Next', 'n', false, '>', ul);
           addLiElement(`${element.id}_page-item-l`, 'Last', 'l', false, '»', ul);
        };
    
        /**
         * 
         * @param {Number} max 
         * @param {Number} current 
         * @param {HTMLElement} ul 
         * @param {HTMLElement} element 
         */
         const midOmitPaging = function(max, current, ul,element){
           const _max = max.toString();
           
           addLiElement(`${element.id}_page-item-f`, 'First', 'f', false, '«', ul);
           addLiElement(`${element.id}_page-item-p`, 'Previous', 'p', false, '<', ul);
           /*** Omit ***/
           addLiElement('page-item-' + '1', '', '1',  false, '1', ul);
           addLiElement(`${element.id}_page-item-o`, 'Omit', 'o', false, '...', ul);
           /*** Omit ***/
           for (let i = current - 2; i <= current + 2; i++) {
               const _i = i.toString();
               addLiElement('page-item-' + _i, '', _i,  i === current, _i, ul);
           }
           /*** Omit ***/
           addLiElement(`${element.id}_page-item-o`, 'Omit', 'o', false, '...', ul);
           addLiElement('page-item-' + _max, '', _max,  false, _max, ul);
           /*** Omit ***/
           addLiElement(`${element.id}_page-item-n`, 'Next', 'n', false, '>', ul);
           addLiElement(`${element.id}_page-item-l`, 'Last', 'l', false, '»', ul);
        };
    
        /**
         * 
         * @param {HTMLElement} ul 
         */
        const paging = function(current, max, ul, element){
            const _fnPaging = pagingFactory(getOMIT(max), current, max);
            ul.innerHTML = '';
            _fnPaging(max, current, ul, element);
            ul.dataset[DATA_KEY_CUR_PAGE] = current;
        }
    
        /**
         * 
         * @param {String} page 
         * @param {Number} current 
         */
        const getNextPage = function(page, current, max){
            switch(page){
                case 'f': return 1;
                case 'p': return current - 1;
                case 'n': return current + 1;
                case 'l': return max;
                case 'o': return current
                default: return page;
            }
        };
    
        /**
         * 
         * @param {HTMLElement} element 
         * @param {Array | Object} data 
         * @param {number} numPerPage 
         * @param {HTMLElement} content 
         * @param {Function} callback 
         */
         const setEventPageClick = function(element, max, data, content, callback){
            const elems = element.getElementsByClassName('page-item');
             for (let i = 0; i < elems.length; i++) {
                elems[i].addEventListener(
                    'click',
                    (e) => pageChange(e.target.dataset[DATA_KEY_PAGE_NO], max, element, data, content, callback), 
                    false);        
            }
        };
    
        /**
         * 
         * @param {String} page 
         * @param {Number} max 
          * @param {HTMLElement} element 
         * @param {Array | Object} data 
         * @param {HTMLElement} content 
         * @param {Function} callback 
         * @returns 
         */
        const pageChange = function(page, max, element, data, content, callback){
            const _ul = document.getElementById(`${element.id}_u-pagination-page-item`);
            const _info = document.getElementById(`${element.id}_box-pagination-page-info`);
            const _current = Number(_ul.dataset[DATA_KEY_CUR_PAGE]);
            const _next = Number(getNextPage(page, _current, max));
            const _pageSize = Number(_info.dataset[DATA_KEY_PER_PAGE]);
    
            if(_next === _current || _next < 1 || max < _next) return;
    
            paging(_next, max, _ul, element);
            setEventPageClick(element, max, data, content, callback);
            
            const _from = _pageSize * (_next - 1);
            const _to = _pageSize * _next;
            const _view = data.slice(_from, _to);
    
            const _pageInfo = document.createElement('div');
            _pageInfo.classList.add('col');
            _pageInfo.append(
               buildSimpleElement('span','from-item-amnt', (_from + 1).toString()),
               buildSimpleElement('span','from-to-item', '-'),
               buildSimpleElement('span','to-item-amnt', (_from + _view.length).toString()),
               buildSimpleElement('span','of-item-total-amnt', '/'),
               buildSimpleElement('span','item-total-amnt', (data.length).toString()),
            );
            _info.innerHTML = '';
            _info.append(_pageInfo);
    
            callback(_next, _view, content);
        };
    
        //public
   
        /**
         * use bootstrap 5 Pagination
         * @param {HTMLElement} element 
         * @param {Array | Object} data 
         * @param {number} numPerPage 
         * @param {Function} callback 
         */
         _.pagination = function(element, data, numPerPage, callback){
            if(element.id === undefined || element.id === null || element.id === '') {
                const _message = `'pageContent' element requires id.`;
                console.error(`${_message}`,'Element:',element);
                throw _message;
            }
        
            element.innerHTML = '';
            const _content = buildelement('div',`${element.id}_box-pagination-content`, 'col', null);
   
            const max = Math.ceil(data.length / numPerPage);
            const _nav = document.createElement('nav');
            const _ul = buildelement('ul', `${element.id}_u-pagination-page-item`, 'pagination justify-content-end', null);
            _nav.setAttribute('aria-label','Page navigation');
            paging(0, max, _ul, element);
            _nav.append(_ul);
    
            const _div = buildelement('div','', 'row', null);
            const _pageInfo = buildelement('div',`${element.id}_box-pagination-page-info`, 'col', null);
            const _pageItem = buildelement('div',`${element.id}_box-pagination-page-item`, 'col', null);
            _pageInfo.dataset[DATA_KEY_PER_PAGE] = numPerPage;
            _pageItem.append(_nav)
            _div.append(_pageInfo, _pageItem);
    
            element.append(_content, _div);         
            pageChange('1', max, element, data, _content, callback);
        };
     
        
   
        /**
         * make view table
         * @param {object} config {element, columns, data, initialize}
         */
         _.buildSimpleTables = function(config){
    
            if(config.initialize)
                config.element.innerHTML = '';
            
            const _data = config.data;
            const _columns = config.columns;
    
            const _box = buildelement('div', 'updateContent', 'upd-simple-container', null);
            const _boxH = buildelement('div', 'updateHeader', 'upd-simple-header', 'overflow:hiden;');
            const _boxD = buildelement('div', 'updateDetail', 'upd-simple-detail', 'overflow:auto;');
            const _tableH = buildelement('table', 'updateTableH', 'upd-simple-table-title', null);
            const _tableD = buildelement('table', 'updateTableD', 'upd-simple-table-content', null);
        
            let _inner = '';
            let _col = {data:"", title:"" ,class:""};
            for(let i = 0, l = _columns.length; i < l; i++){
                _col = _columns[i];
                if(_col.visible === false)
                    _inner += `<th scope="col" class="${_col.class}" style="display:none;">${_col.title}</th>`;
                else
                    _inner += `<th scope="col" class="${_col.class}">${_col.title}</th>`;
            }
            _tableH.innerHTML = `<thead><tr>${_inner}</tr></thead>`;
    
            let _sw = 1; 
            let _class = '';
            let _customAttr = '';
            let _disp = '';
            for(let row = 0, l = _data.length; row < l; row++){
                const _tr = buildelement('tr', '', '', '');
                _inner = '';
   
                _tr.className = (_sw === 1) ? 'odd' : 'even';
                 
                for(let col = 0, l = _columns.length; col < l; col++){
                    _col = _columns[col];
                    _disp = (_col.visible === false) ? `style="display:none;"` : '';
                    _class = (_col.class == null) ? '' : _col.class;
                    _customAttr = (_col.customAttribute == null) ? '' : _col.customAttribute;
    
                    if(_col.render == null)
                        _inner += `<td class="${_class}" ${_disp} ${_customAttr}>${_data[row][_col.data]}</td>`;
                    else 
                        _inner += `<td class="${_class}" ${_disp} ${_customAttr}>${_col.render(_data[row])}</td>`;
                }
                _tr.innerHTML = _inner;
                _tableD.append(_tr);
                _sw *= -1;
            }
            _tableD.innerHTML = `<tbody>${_tableD.innerHTML}</tbody>`;
    
            _boxH.append(_tableH);
            _boxD.append(_tableD);
    
            _boxD.addEventListener('scroll', (e) => {_boxH.scrollLeft = _boxD.scrollLeft;}, false);
            _box.append(_boxH, _boxD)
    
            config.element.append(_box);
        };
    
        /**
         * add class 
         * @param {string} className 
         * @param {string[]} addClass 
         */
        _.addClassByClassName =function(className, addClass){
            const _elems = document.getElementsByClassName(className);
            for (let i = 0, l = _elems.length; i < l; i++) {
                _elems[i].classList.add(addClass);               
            }
        };
    
    })(root.table);

    
})(whiteSuggar);