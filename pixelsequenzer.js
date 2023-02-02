var num_rows = 1;
var number_of_pixels = 0;
var x;
function render_table() {

    $('#arraytable').html(''); // clear tablefield
    num_rows = 1;

number_of_pixels = $('#numPixels').val();
    /* Note that the whole content variable is just a string */
    var content = '<table class="table"><thead><tr><th scope="col" class="text-right">#</th>';
    for(i=1;i<=number_of_pixels;i++){
        content += '<th scope="col" class="text-center">' + i + '</th>';
    }
    content += '<th scope="col">Delay</th></tr></thead><tbody>';

    for(r=0;r<num_rows;r++){
        content += '<tr class="pixelrow r'+ (r+1) +'"><th scope="row" class="text-right">' + (r+1) + '</th>';
        
        for(x=1;x<=number_of_pixels;x++){
            content += '<td><input type="color" class="basic" value="#000000" /></td>'
        }
        
        content += '<td><input type="number" value="100" size="5" class="delays"></td></tr>';
    }

    //content += '<tr class="appender"><th scope="row"><button id="addRow" class="btn" onclick="append_row()">+</button></th><td colspan="'+ (number_of_pixels) +'"></td><td><button class="btn" onclick="createArray()">create</button></td></tr></tbody></table>';
    content += '<tr class="appender"></tr></tbody></table>';

    $('#arraytable').append(content);

}

function append_row(){
    num_rows++;
    var content = '<tr class="pixelrow r'+ num_rows +'"><th scope="row"  class="text-right">' + num_rows + '</th>';
    
    for(x=1;x<=number_of_pixels;x++){
        content += '<td><input type="color" class="basic" value="#000000" /></td>'
    }
    
    content += '<td><input type="number" value="100" size="5" class="delays"></td></tr>';

    $(content).insertBefore(".appender");
}

function createArray(){
    var pixels, delays;
    
    var all = $("input.basic").map(function(){
        return $(this).val();
    }).get();

    var alldelays = $("input.delays").map(function(){
        return $(this).val();
    }).get();    
    
    pixels = 'const byte pixels[][3] = {';
    delays = 'const long delays[] = {';

    var i=0;
    // convert hex to int 
    while(all.length > i){
        all[i] = '{' + hexToRgb(all[i]) + '}';
        i++;    
    }
    pixels += all.join() + '};\r\n';

    i=0;
    

    delays += alldelays.join() + '};';

    $("#arrayShow").html('<pre class="text-wrap">'+ pixels + delays +'</pre>');

}


function render_edittable(){
    $('#arraytable').html(''); // clear tablefield

    //get pixels
    let result = $("#editArray").val().replace(/byte|word|long|int|const|pixels|delays|\[.*\]|=| |;\n.*/gm, "");
    result = result.replace(/\{/gm, "[");
    result = result.replace(/\}/gm, "]");
    //alert( result);
    var pixels = JSON.parse(result);
    
    //get delays
    result = $("#editArray").val().replace(/byte|word|long|int|const|pixels|delays|\[.*\]|=|;/gm, "");
    result = result.replace(/.*\n|;/m, "");
    result = result.replace(/\{/gm, "[");
    result = result.replace(/\}/gm, "]");
    //alert( result);
    var delays = JSON.parse(result);
    //result = result.replace(/const/gm, "");
    //result = result.replace(/\[\]|\[3\]/gm, "");

    //eval(result);   //evalute string

    number_of_pixels = pixels.length/delays.length;
    num_rows = delays.length;
    $('#numPixels').val(number_of_pixels);
    
    var content = '<table class="table"><thead><tr><th scope="col" class="text-right">#</th>';
    for(i=1;i<=number_of_pixels;i++){
        content += '<th scope="col" class="text-center">' + i + '</th>';
    }
    content += '<th scope="col">Delay</th></tr></thead><tbody>';

    for(r=0;r<num_rows;r++){
        content += '<tr class="pixelrow r'+ (r+1) +'"><th scope="row" class="text-right">' + (r+1) + '</th>';
        
        for(i=0;i<number_of_pixels;i++){
            content += '<td><input type="color" class="basic" value="'+ rgbToHex(pixels[r*number_of_pixels + i][0],pixels[r*number_of_pixels + i][1],pixels[r*number_of_pixels + i][2]) +'" /></td>'
        }
        
        content += '<td><input type="number" value="'+ delays[r] +'" size="5" class="delays"></td></tr>';
    }

    //content += '<tr class="appender"><th scope="row"><button id="addRow" class="btn" onclick="append_row()">+</button></th><td colspan="'+ (number_of_pixels) +'"></td><td><button class="btn" onclick="createArray()">create</button></td></tr></tbody></table>';
    content += '<tr class="appender"></tr></tbody></table>';

    $('#arraytable').append(content);

}

const rgbToHex = (r, g, b) => '#' + [r, g, b]
  .map(x => x.toString(16).padStart(2, '0')).join('');

const hexToRgb = hex =>
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16));