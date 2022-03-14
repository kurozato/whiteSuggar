
const whiteSuggar = window.whiteSuggar || {};

(function(root){
    root.table = root.table || {};
    (function(_){

        /**
         * 
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
         * 
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
