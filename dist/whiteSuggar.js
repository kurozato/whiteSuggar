

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

            let _obj = {};
            let _col = [];
            for(let i=0; i<_max; i++){
                _obj = {};
                _col = _hash[i].split('=');
                // _ary.push('name');
                // _ary.push('value');
                _obj['name'] = _col[0];
                _obj['value'] = decodeURIComponent(_col[1]);
                _vals.push(_obj);
            }

            return _vals;
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
         * replace url part of search and hash
         * @param {string} search 
         * @param {string} hash 
         */
        _.replaceUrl = function(search, hash){

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
         * @param {Object} obj 
         * @returns {string}
         */
        _.convertSearchString = function(obj){
            const _keys = Object.keys(obj);
            let _search = '';
        
            for(let i=0, l = _keys.length; i < l; i++){
                _search = _search + `&${_keys[i]}=${obj[_keys[i]]}`;
            }

            return _search.substring(1);
        };

        /**
         * convert formData to query string
         * @param {FormData} formData 
         */
        _.convertSearchStringFormData = function(formData){
            let _search = '';

            for(let _val of formData.entries()){
                _search = _search + `&${_val[0]}=${_val[1]}`;
            }

            return _search.substring(1);
        };
        /**
         * convert formData to dictionary object
         * @param {FormData} formData 
         */
        _.convertDictionary = function(formData){
            const data = {};
            for(let _val of formData.entries()){
                data[_val[0]] = _val[1];
            }
            return data;
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


    //whiteSuggar.table
    
    root.table = root.table || {};
    (function(_){

        // local
  
        const pagingFooterFactory = function(pageContent, maxPage, pageSize){
            const _1st = `<li class="page-item" id="${pageContent.id}_page-item-f" style="cursor:pointer;"><a class="page-link" aria-label="First" data-page="f">&laquo;</a></li>`;
            const _pre = `<li class="page-item" id="${pageContent.id}_page-item-p" style="cursor:pointer;"><a class="page-link" aria-label="Previous" data-page="p">&lt;</a></li>`;
            const _nxt = `<li class="page-item" id="${pageContent.id}_page-item-n" style="cursor:pointer;"><a class="page-link" aria-label="Next" data-page="n">&gt;</a></li>`;
            const _lst = `<li class="page-item" id="${pageContent.id}_page-item-l" style="cursor:pointer;"><a class="page-link" aria-label="Last" data-page="l">&raquo;</a></li>`;
    
            const _nav = document.createElement('nav');
            //const _ul = document.createElement('ul');
            const _ul = buildelement('ul', `${pageContent.id}_u-pagination-page-item`, 'pagination justify-content-end', null);
            /**li elements (string) */
            let _lis = '';

            _nav.setAttribute('aria-label','Page navigation');
            // _ul.classList.add('pagination','justify-content-end');
            // _ul.id = "u-pagination-page-item";
            
            _ul.dataset.currentPage = '1';
            _ul.dataset.maxPage = maxPage;
            _ul.dataset.pageSize = pageSize;

            _lis = _1st + _pre;
            _lis = _lis + `<li class="page-item active" id="${pageContent.id}_page-item-1" style="cursor:pointer;"><a class="page-link" data-page="1">1</a></li>`;
            for (let i = 2; i <= maxPage; i++) {
                _lis = _lis + `<li class="page-item" id="${pageContent.id}_page-item-${i}" style="cursor:pointer;"><a class="page-link" data-page="${i}">${i}</a></li>`;
            }
            _lis = _lis + _nxt + _lst;
            _ul.innerHTML = _lis;
            _nav.append(_ul);

            // const _div = document.createElement('div');
            // const _pageInfo = document.createElement('div');
            // const _pageItem = document.createElement('div');
            // _pageInfo.id = 'box-pagination-page-info';
            // _pageItem.id = 'box-pagination-page-item';

            // _pageInfo.classList.add('col');
            // _pageItem.classList.add('col');
            // _pageItem.append(_nav)
            // _div.classList.add('row');
            const _div = buildelement('div','', 'row', null);
            const _pageInfo = buildelement('div',`${pageContent.id}_box-pagination-page-info`, 'col', null);
            const _pageItem = buildelement('div',`${pageContent.id}_box-pagination-page-item`, 'col', null);
            _pageItem.append(_nav)
            _div.append(_pageInfo,_pageItem);

            pageContent.append(_div);
        };
        
        const togglePageNo = function(item, data, callback, pageContent){
            let _page = Number(item);
            const _ul = document.getElementById(`${pageContent.id}_u-pagination-page-item`);
            let _current = Number(_ul.dataset.currentPage);
            const _maxPage = Number(_ul.dataset.maxPage);
            const _pageSize = Number(_ul.dataset.pageSize);

            if(item === 'p')
                _page = _current - 1;

            if(item === 'n')
                _page = _current + 1; 
                
            if(item === 'f' || _page < 1)
                _page = 1; 
            
            if(item === 'l' || _page > _maxPage)
                _page = _maxPage;
            
            if(_page == _current) return;

            const _before =  document.getElementById(`${pageContent.id}_page-item-${_current}`);
            const _item = document.getElementById(`${pageContent.id}_page-item-${_page}`);

            _before.classList.remove('active');
            _item.classList.add('active')
            
            _ul.dataset.currentPage = _page;

            const _from = _pageSize * (_page - 1);
            const _to = _pageSize * _page;
            const _view = data.slice(_from, _to);

            //togglePageInfo(data);
            togglePageInfo(_from, _view, data, pageContent);
            callback(_page, _view)
        };

        const togglePageInfo = function(from, view, data, pageContent){
            const _box =  document.getElementById(`${pageContent.id}_box-pagination-page-info`);
            const _pageInfo = `<sapn id="from-item-amnt">${from + 1}</sapn> <sapn id="from-to-item">-</sapn> <sapn id="to-item-amnt">${from + view.length}</sapn> <sapn id="of-item-total-amnt">/</sapn> <sapn id="item-total-amnt">${data.length}</sapn>`;
            _box.dataset.fromItem = (from + 1);
            _box.dataset.ToItem = (from + view.length);
            _box.dataset.ItemTotal = (data.length);
            _box.innerHTML = `<div class="col">${_pageInfo}</div>`;
        };

        const setEventPageClick = function(pageContent, data, callback){
            const elems = pageContent.getElementsByClassName('page-item');
             for (let i = 0; i < elems.length; i++) {
                elems[i].addEventListener(
                    'click',
                    (e) => togglePageNo(e.target.dataset.page, data, callback, pageContent), 
                    false);        
            }
        }

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

        //public

        /**
         * use bootstrap 5 Pagination
         * @param {HTMLElement} pageContent 
         * @param {Array} data 
         * @param {Number} pageSize 
         * @param {Function} callback 
         */
        _.pagination = function(pageContent, data, pageSize, callback){
            if(pageContent.id === undefined || pageContent.id === null || pageContent.id === '') {
                const _message = `'pageContent' element requires id.`;
                console.error(`${_message}`,'Element:',pageContent);
                throw _message;
            }

            const maxPage = Math.ceil(data.length / pageSize);
            if(maxPage == 0) return;
            pagingFooterFactory(pageContent, maxPage, pageSize);
            setEventPageClick(pageContent, data, callback);
            const _view = data.slice(0, pageSize);
            togglePageInfo(0, _view, data, pageContent);
            callback(1, _view);
        };

        _.addupToPageSize = function(data, pageSize){
            const len = pageSize - data.length;
            const _data = [];
            if( len > 0){
                const _obj = {};
                const _key = Object.keys(data[0]);
                for (let col = 0; col < _key.length; col++) {
                    _obj[_key[col]] = '';                    
                } 

                let row 
                for (row= 0; row < data.length; row++) {
                    _data.push(data[row]);
                }
                for (row = 0; row < len; row++) {
                    _data.push(_obj);
                }
                return _data;
            }
            else return data;
        };
        /**
         * use bootstrap 5 Pagination, make view table
         * @param {HTMLTableElement} table 
         * @param {Array} data 
         * @param {Array} columns 
         * {column: string, label: string, class: string, visible: boolean, render: function }
         */
        _.updateTable = function(table, columns, data){
            const _thead = document.createElement('thead');
            const _tbody = document.createElement('tbody');
            table.classList.add('table');
            table.innerHTML = '';

            let _th = '<tr>';
            for (let i = 0; i < columns.length; i++) {
                _th = _th + `<th scope="col">${columns[i].label}</th>`
            }
            _th = _th + '</tr>';
            _thead.innerHTML = _th;
            
            let _inner = ''
            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                let _tr = '<tr>';
                for (let j = 0; j < columns.length; j++) {
                    let _td = '<td>';
                    if(columns[j].visible === false)
                        _td = '<td style="display:none;">';
                    
                    if(columns[j].class != null)
                        _td = `<td class="${columns[j].class}">`;

                    if(columns[j].render == null)
                        _tr = _tr + _td + `${row[columns[j].column]}</td>`;
                    else
                        _tr = _tr + _td + `${columns[j].render(row[columns[j].column])}</td>`;
                }
                _tr = _tr + '</tr>';
                _inner = _inner + _tr;
            }
            _tbody.innerHTML = _inner;
            table.append(_thead, _tbody);
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
        
            const DISP_NONE = `style="display:none;"`;
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
                const _tr = buildelement('tr', '', '', null);
                _inner = '';

                _tr.className = (_sw === 1) ? 'odd' : 'even';
       
                // if(_sw === 1)
                //     _tr.className = 'odd';
                // else 
                //     _tr.className = 'even'
                
                for(let col = 0, l = _columns.length; col < l; col++){
                    _col = _columns[col];
                    // if(_col.visible === false)
                    //     _disp = `style="display:none;"`
                    // else 
                    //     _disp = '';
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






