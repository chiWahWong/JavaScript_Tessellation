// JavaScript Document

function Tessellation(parameters){
    var tiles_container       = parameters.tessellation.addClass('tiles-container');
    var tiles                 = tiles_container.find('.tile');
    var _CELL_MIN_WIDTH       = 200;
    var _CELLS_COLUMNS_MAX    = 6;
    var _cells_needed_columns = 0;
    var _cells_needed_cells   = 0;
    var _cells_needed_rows    = 0;
    var _cells_needed_skip    = 0;
    var _cells_skip_interval  = 0;
    var _cell_width           = 0;
    var _cells_map            = [];
    var _cells_occupied       = 0;
    var _TILES_BIG_INTERVAL_RANDOM_RANGE = 6;
    var _TILES_BIG_INTERVAL_BASE         = 0;
    var _tiles_container_width           = 0;
    var _tiles_size_set_needed           = true;
    
    _tilesOnCells();
    $(window).resize(function(){
        _tilesOnCells();
    });
    
    function _debug(){
        console.log('\ndebug'+'\n'
            +'_cells_needed_cells : '  + _cells_needed_cells   +'\n'
            +'_cells_needed_columns : '+ _cells_needed_columns +'\n'
            +'_cells_needed_rows : '   + _cells_needed_rows    +'\n'
            +'_cells_needed_skip : '   + _cells_needed_skip    +'\n'
            +'_cells_skip_interval : ' + _cells_skip_interval  +'\n'
            +'_cells_map : '           + _cells_map);
    }
    function _cells_calculate(){
        _tiles_container_width = tiles_container.width();
        _cells_needed_columns_set();
        _tiles_size_set();
        _cells_needed_cells_set();
        _cells_needed_rows_set();
        _cells_skip_set();
        _cell_width_set();
        _cells_map_initialize();
    }
    function _cells_needed_columns_set(){
        //_cells_needed_columns = Math.floor(_tiles_container_width / _CELL_MIN_WIDTH);
        if(_tiles_container_width < 600){
            _cells_needed_columns = 3;
        }else if(_tiles_container_width < 800){
            _cells_needed_columns = 4;
        }else if(_tiles_container_width < 1000){
            _cells_needed_columns = 5;
        }else{
            _cells_needed_columns = _CELLS_COLUMNS_MAX;
        }
    }
    function _cells_needed_cells_set(){
        _cells_needed_cells = 0;
        tiles.each(function(){
            if($(this).hasClass('big')){
                _cells_needed_cells += 4;
            }else{
                _cells_needed_cells++;
            }
        });
    }
    function _cells_needed_rows_set(){
        _cells_needed_rows = Math.ceil(_cells_needed_cells / _cells_needed_columns);
    }
    function _cells_skip_set(){
        _cells_needed_skip   = (_cells_needed_cells % _cells_needed_columns) ? _cells_needed_columns - (_cells_needed_cells % _cells_needed_columns)          : 0;
        _cells_skip_interval = _cells_needed_skip                            ? Math.ceil(_cells_needed_rows * _cells_needed_columns / (_cells_needed_skip+1)) : 0;
    }
    function _cell_width_set(){
        _cell_width = Math.floor(_tiles_container_width / _cells_needed_columns);
    }
    function _cells_map_initialize(){
        _cells_map = [];
        for(var r = 0; r < _cells_needed_rows; r++){
            _cells_map.push([]);
            for(var c = 0; c < _cells_needed_columns; c++){
                _cells_map[r].push({
                    status     : 0,
                    properties : _cell_properties_get(r,c)
                });
            }
        }
    }
    function _cell_properties_get(cell_row, cell_column){
        var table_width_remainder = _tiles_container_width % _cells_needed_columns;
        return {
            left   : (cell_column * _cell_width) + Math.min(cell_column, table_width_remainder),
            top    : cell_row * _cell_width,
            width  : _cell_width + (cell_column < table_width_remainder ? 1 : 0),
            height : _cell_width
        };
    }
    function _tiles_size_set(){
        if(!_tiles_size_set_needed){ return; }
        var big_next_countdown = _tile_big_next_get();
        tiles.each(function(index, element){
// $(this).prepend('<h4>'+index+'</h4>');
            if(_cells_hasSpaceForTileBig_is(index+1) && big_next_countdown === 0){
                $(this).addClass('big');
                big_next_countdown = _tile_big_next_get();
            }else{
                // $(this).removeClass('big');
                big_next_countdown--;
            }
        });
        _tiles_size_set_needed = false;
    }
    function _cells_hasSpaceForTileBig_is(tile_nTh){
        return tile_nTh <= (tiles.length - _CELLS_COLUMNS_MAX - 1);
    }
    function _tile_big_next_get(){
        return Math.floor(((Math.random() * 10) % _TILES_BIG_INTERVAL_RANDOM_RANGE) + _TILES_BIG_INTERVAL_BASE);
    }
    function _tiles_container_height_set(){
        tiles_container.height(_cell_width * _cells_needed_rows);
    }
    function _tilesOnCells(){
        _cells_calculate();
        _tiles_container_height_set();
        // repeat the previous 2 steps to get the correct dimensions
        _cells_calculate();
        _tiles_container_height_set();
        _cells_occupy_reset();
        _cells_occupied = 0;
        tiles.each(function(){
            _cells_nextEmpty_occupy($(this));
        });
        parameters.tilesOnCells_complete();
        _tiles_raw_remove();
// _debug();
    }
    function _cells_nextEmpty_occupy(tile){
        var cells_nextEmpty_properties = _cells_nextEmpty_properties_get(tile);
        tile.css(cells_nextEmpty_properties);
    };
    function _cells_nextEmpty_properties_get(tileOrSkip){
        for(var r = 0; r < _cells_needed_rows; r++){
            for(var c = 0; c < _cells_needed_columns; c++){
                if(_cells_map[r][c].status === 0){
                    if(tileOrSkip != 'skip' && tileOrSkip.hasClass('big')){
                        if(
                            c !== _cells_needed_columns-1     &&
                            _cells_map[r]  [c+1].status === 0 &&
                            _cells_map[r+1][c]  .status === 0 &&
                            _cells_map[r+1][c+1].status === 0
                        ){
                            _cells_map[r]  [c]  .status = 1;
                            _cells_map[r]  [c+1].status = 1;
                            _cells_map[r+1][c]  .status = 1;
                            _cells_map[r+1][c+1].status = 1;
                            for(var i = 0; i < 4; i++){
                                _cells_occupied++;
                                _cells_nextEmpty_skip();
                            }
                            return {
                                left   : _cells_map[r][c].properties.left,
                                top    : _cells_map[r][c].properties.top,
                                width  : _cells_map[r][c].properties.width  + _cells_map[r]  [c+1].properties.width,
                                height : _cells_map[r][c].properties.height + _cells_map[r+1][c]  .properties.height
                            };
                        }
                    }else{
                        _cells_map[r][c].status = tileOrSkip === 'skip' ? 0.5 : 1;
                        _cells_occupied++;
                        _cells_nextEmpty_skip();
                        return _cells_map[r][c].properties;
                    }
                }
            }
        }
    }
    function _cells_nextEmpty_skip(){
        if(_cells_skip_interval !== 0 && _cells_occupied !== 0 && (_cells_occupied % _cells_skip_interval) === 0){
            _cells_nextEmpty_properties_get('skip');
        }
    }
    function _cells_occupy_reset(){
        for(var r = 0; r < _cells_needed_rows; r++){
            for(var c = 0; c < _cells_needed_columns; c++){
                _cells_map[r][c].status = 0;
            }
        }
    }
    function _tiles_raw_remove(){
        var tile_next = $('.tile.raw:first');
        if(tile_next.length){
            setTimeout(function(){
                tile_next
                    .hide()
                    .css({'margin-top':0})
                    .stop(true, true)
                    .fadeIn(2000, function(){
                        $(this).css({'margin-top':''});
                    })
                    .removeClass('raw');
                _tiles_raw_remove();
            }, 200);
        }
    }
}
