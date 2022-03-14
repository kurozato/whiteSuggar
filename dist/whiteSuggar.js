

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


    //whiteSuggar.paging
    
    root.paging = root.paging || {};
    (function(_){

        // local
  
        const pagingFooterFactory = function(pageContent, maxPage, pageSize){
            const _1st = '<li class="page-item" id="page-item-f" style="cursor:pointer;"><a class="page-link" aria-label="First" data-page="f">&laquo;</a></li>';
            const _pre = '<li class="page-item" id="page-item-p" style="cursor:pointer;"><a class="page-link" aria-label="Previous" data-page="p">&lt;</a></li>';
            const _nxt = '<li class="page-item" id="page-item-n" style="cursor:pointer;"><a class="page-link" aria-label="Next" data-page="n">&gt;</a></li>';
            const _lst = '<li class="page-item" id="page-item-l" style="cursor:pointer;"><a class="page-link" aria-label="Last" data-page="l">&raquo;</a></li>';
    
            const _nav = document.createElement('nav');
            const _ul = document.createElement('ul');
            /**li elements (string) */
            let _lis = '';

            _nav.setAttribute('aria-label','Page navigation');
            _ul.classList.add('pagination','justify-content-end');
            _ul.id = "u-pagination-page-item";

            _ul.dataset.currentPage = '1';
            _ul.dataset.maxPage = maxPage;
            _ul.dataset.pageSize = pageSize;

            _lis = _1st + _pre;
            _lis = _lis + `<li class="page-item active" id="page-item-1" style="cursor:pointer;"><a class="page-link" data-page="1">1</a></li>`;
            for (let i = 2; i <= maxPage; i++) {
                _lis = _lis + `<li class="page-item" id="page-item-${i}" style="cursor:pointer;"><a class="page-link" data-page="${i}">${i}</a></li>`;
            }
            _lis = _lis + _nxt + _lst;
            _ul.innerHTML = _lis;
            _nav.appendChild(_ul);

            const _div = document.createElement('div');
            const _pageInfo = document.createElement('div');
            const _pageItem = document.createElement('div');
            _pageInfo.id = 'box-pagination-page-info';
            _pageItem.id = 'box-pagination-page-item';

            _pageInfo.classList.add('col');
            _pageItem.classList.add('col');
            _pageItem.appendChild(_nav)
            _div.classList.add('row');
            _div.appendChild(_pageInfo);
            _div.appendChild(_pageItem);

            pageContent.appendChild(_div);
        };
        
        const togglePageNo = function(item, data, callback){
            let _page = Number(item);
            const _ul = document.getElementById('u-pagination-page-item');
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

            const _before =  document.getElementById(`page-item-${_current}`);
            const _item = document.getElementById(`page-item-${_page}`);

            _before.classList.remove('active');
            _item.classList.add('active')
            
            _ul.dataset.currentPage = _page;

            const _from = _pageSize * (_page - 1);
            const _to = _pageSize * _page;
            const _view = data.slice(_from, _to);

            //togglePageInfo(data);
            togglePageInfo(_from, _view, data);
            callback(_page, _view)
        };

        const togglePageInfo = function(from, view, data){
            const _pageInfo = `<sapn id="from-item-amnt">${from + 1}</sapn> <sapn id="from-to-item">-</sapn> <sapn id="to-item-amnt">${from + view.length}</sapn> <sapn id="of-item-total-amnt">/</sapn> <sapn id="item-total-amnt">${data.length}</sapn>`;
            document.getElementById('box-pagination-page-info').innerHTML = `<div class="col">${_pageInfo}</div>`;
        };

        const setEventPageClick = function(pageContent, data, callback){
            const elems = pageContent.getElementsByClassName('page-item');
             for (let i = 0; i < elems.length; i++) {
                elems[i].addEventListener(
                    'click',
                    (e) => togglePageNo(e.target.dataset.page, data, callback), 
                    false);        
            }
        }

        //public

        /**
         * use bootstrap 5 Pagination
         * @param {HTMLElement} pageContent 
         * @param {Array} data 
         * @param {Number} pageSize 
         * @param {Function} callback 
         */
        _.pagination = function(pageContent, data, pageSize, callback){
            const maxPage = Math.ceil(data.length / pageSize);
            if(maxPage == 0) return;
            pagingFooterFactory(pageContent, maxPage, pageSize);
            setEventPageClick(pageContent, data, callback);
            const _view = data.slice(0, pageSize);
            togglePageInfo(0, _view, data);
            callback(1, _view);
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
            table.appendChild(_thead);
            
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
            table.appendChild(_tbody);
        };
        
    })(root.paging);
    
    //whiteSuggar.table

    root.table = root.table || {};
    (function(_){

        /**
         * table Element Build
         * @param {object} config {elemnt, columns, data}
         * @param {boolean} init
         */
        _.buildSimpleTables = function(config){

            if(config.initialize)
                config.elemnt.innerHTML = '';
            
            const _data = config.data;
            const _columns = config.columns;

            const _box = buildElemnt('div', 'updateContent', 'upd-simple-container', null);
            const _boxH = buildElemnt('div', 'updateHeader', 'upd-simple-header', 'overflow:hiden;');
            const _boxD = buildElemnt('div', 'updateDetail', 'upd-simple-detail', 'overflow:auto;');
            const _tableH = buildElemnt('table', 'updateTableH', 'upd-simple-table-title', null);
            const _tableD = buildElemnt('table', 'updateTableD', 'upd-simple-table-content', null);
        
            const DISP_NONE = `style="display:none;"`;
            let _inner = '';
            let _col = {data:"", label:"" ,class:""};
            for(let i = 0, l = _columns.length; i < l; i++){
                _col = _columns[i];
                if(_col.visible === false)
                    _inner += `<th class="${_col.class}">${_col.label}</th>`;
                else
                    _inner += `<th class="${_col.class}" style="display:none;">${_col.label}</th>`;
            }
            _tableH.innerHTML = `<thead><tr>${_inner}</tr></thead>`;

            let _sw = 1; 
            let _disp = '';
            for(let row = 0, l = _data.length; row < l; row++){
                const _tr = buildElemnt('tr', '', '', null);
                _inner = '';
                if(_sw === 1)
                    _tr.className = 'odd';
                else 
                    _tr.className = 'even'
                
                for(let col = 0, l = _columns.length; col < l; col++){
                    _col = _columns[col];
                    if(_col.visible === false)
                        _disp = `style="display:none;"`
                    else 
                        _disp = '';

                    if(_col.render == null)
                        _inner += `<td class="${_col.class}" ${_disp}>${_data[row][_col.data]}</td>`;
                    else 
                        _inner += `<td class="${_col.class}" ${_disp}>${_col.render(_data[row][_col.data])}</td>`;
                }
            _tr.innerHTML = _inner;
            _tableD.appendChild(_tr);
                _sw *= -1;
            }
            _tableD.innerHTML = `<tbody>${_tableD.innerHTML}</tbody>`;

            _boxH.appendChild(_tableH);
            _boxD.appendChild(_tableD);

            _boxD.addEventListener('scroll', (e) => {_boxH.scrollLeft = _boxD.scrollLeft;}, false);
            _box.appendChild(_boxH)
            _box.appendChild(_boxD)

            config.elemnt.appendChild(_box);
        };

        /**
         * Create Element
         * @param {string} tagName 
         * @param {string} id 
         * @param {string} className 
         * @param {string} cssText 
         * @returns {Element}
         */
        const buildElemnt = function(tagName, id, className, cssText){
            const _elem = document.createElement(tagName);
            _elem.id = id;
            _elem.className = className;
            _elem.style.cssText = cssText;
            return _elem;
        };

    })(root.table);

})(whiteSuggar);






