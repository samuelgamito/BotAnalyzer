import * as $ from 'jquery';
import swal from 'sweetalert';
import html2canvas from 'html2canvas';
import {setUtilizacaoFerramenta} from '../charts/chartJS/index'


export default (function () {
  var logConversaFull ;
  // ------------------------------------------------------
  // @Drop Zone
  // ------------------------------------------------------
  function createUsuarioBlock(frase, timestamp){
    return '<div class="peers fxw-nw">'+
    '  <div class="peer mR-20">'+
    '    <img class="w-2r bdrs-50p" src="https://support.aminoapps.com/system/photos/1141/0640/1813/profile_image_114751843574_2020272.png" alt="">'+
    '  </div>'+
    '  <div class="peer peer-greed">'+
    '    <div class="layers ai-fs gapY-5">'+
    '      <div class="layer">'+
    '        <div class="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">'+
    '          <div class="peer mR-10">'+
    `           <small>${timestamp}</small>`+
    '          </div>'+
    '          <div class="peer-greed">'+
    `            <span>${frase}</span>`+
    '          </div>'+
    '        </div>'+
    '      </div>'+
    '    </div>'+
    '  </div>'+
    '</div>';
  }
  function createBotBlock(frase, timestamp){
    return '<div class="peers fxw-nw ai-fe">'
    +'    <div class="peer ord-1 mL-20">'
    +'        <img class="w-2r bdrs-50p" src="https://robohash.org/U9H.png?set=set3&size=150x150" alt="">'
    +'    </div>'
    +'    <div class="peer peer-greed ord-0">'
    +'        <div class="layers ai-fe gapY-10">'
    +'            <div class="layer">'
    +'                <div class="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">'
    +'                    <div class="peer mL-10 ord-1">'
    +`                        <small>${timestamp}</small>`
    +'                    </div>'
    +'                    <div class="peer-greed ord-0">'
    +`                        <span>${frase}</span>`
    +'                    </div>'
    +'                </div>'
    +'            </div>'
    +'        </div>'
    +'    </div>'
    +'</div>';
  }
  function appendOptionLog(conversas){
    console.log(conversas);
    $.each(conversas, (key, value)=>{
      var option = new Option(key, key);
      $('#selectLog').append($(option));
    })
  }
  $('.remove-image').on('click', function(e) {
    removeUpload();
  })
  function show_dash(id){
    $.ajax({
      url: `http://localhost:3030/dashboard/${id}`,
      type: "GET",
      method: "GET",
      contentType: "json",
      cache: false,
      success: function(data){
        $.each(data.dashboard.logConversa, (key, value)=>{
          var htmlLog = "";
          value.conversa.forEach( conv =>{
            htmlLog += createUsuarioBlock(conv.pergunta, conv.horario);
            htmlLog += createBotBlock(conv.resposta, conv.horario);
          });
          data.dashboard.logConversa[key]['htmlLog'] = htmlLog;
        })

        logConversaFull = data.dashboard.logConversa;
        
        appendOptionLog(data.dashboard.logConversa);
        $('#total-de-perguntas').html(data.dashboard.totalDePerguntas);
        $('#perguntas-nao-respondidas').html(data.dashboard.totalDePerguntasNaoRespondidas);
        $('#numero-de-utilizacoes').html(data.dashboard.numeroDeUtilizacoes);
        setUtilizacaoFerramenta(data.dashboard.utilizacaoFerramenta);
      },
      error: function(e) {
        console.log(e)
      }          
    });

  }


  $('#inputState').change(function(){
    $('.utlizacao-chart').fadeOut();
    $($('#inputState').val()).fadeIn();
  })
  $('#selectLog').change(function(){
    var id = $('#selectLog').val();
    $("#chat-screen").html(logConversaFull[id]['htmlLog']);
    $("#total-interacao").html(logConversaFull[id].conversa.length)
  })
  $('.file-upload-input').change(function(e){
    var input = e.target;
    if (input.files && input.files[0]) {
  
      var reader = new FileReader();
  
      reader.onload = function(e) {
        $('.image-upload-wrap').hide();
  
        $('.file-upload-content').show();
  
        $('.title-uploaded-file').html(input.files[0].name);
      };
  
      reader.readAsDataURL(input.files[0]);
  
    } else {
      removeUpload();
    }
  })
  
  function removeUpload() {
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
  }
  $('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
  });
  $('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
  });

  $('.file-upload-btn').on('click', function(){
    $('.file-upload-input').trigger( 'click' )
  })


  $('#upload-log').submit(function(event){
    var formSend = new FormData()
    var file = $('.file-upload-input').get(0).files[0];
    formSend.append('log',file);
    $.ajax({
      url: "http://localhost:3030/upload",
      type: "POST",
      method: "POST",
      data: formSend ,
      contentType: false,
      cache: false,
      processData:false,
      beforeSend : function(){
      },
      success: function(data){
        console.log(data);
        if(!data.status){
          swal("Encontramos um problema!", data.info, "error");
        }else{
          show_dash(data.id);
        }
      },
      error: function(e) {
        console.log(e)
      }          
    });


    event.preventDefault();
  })
  //Enviando via ajax para o servidor
  $(".send-log").on('click', function(){
    $('#upload-log').submit();
  })

  var words = [
    {text: "Mistake", weight: 20},
    {text: "Error", weight: 18.5},
    {text: "Test Case", weight: 17.4},
    {text: "Program", weight: 16.5},
    {text: "Software Testing", weight: 16.4},
    {text: "Functional Testing", weight: 14.3 },
    {text: "Black Box Testing", weight: 13.5},
    {text: "Structural Testing", weight: 13},
    {text: "Test Set", weight: 13},
    {text: "Boundary", weight: 12},
    {text: "Bug", weight: 12.1},
    {text: "Defect", weight: 11},
    {text: "Code", weight: 10.9},
    {text: "Incorrect", weight: 10.5},
    {text: "Analysis", weight: 10.1},
    {text: "Partitioning", weight: 9},
    {text: "Criteria", weight: 8.9},
    {text: "Technique", weight: 8.1},
    {text: "Input", weight: 7.5},
    {text: "Activity", weight: 6.5},
    {text: "Produced", weight: 5.5},
    {text: "Conditions", weight: 5.0},
    {text: "Execution", weight: 4.9},
    {text: "Expected", weight: 4},
    {text: "Limit Value", weight: 3.9},
    {text: "Output", weight: 3.5},
    {text: "Invalid", weight: 3.4},
    {text: "Test Data", weight: 3.1},
    {text: "Processing", weight: 3},
    {text: "Implementation", weight: 2},
  ];
  $('#assuntos-frequentes').jQCloud(words, {
    width: 500,
    height: 265,
    removeOverflowing: true,
    autoResize: true
  });
  // ------------------------------------------------------
  // @Window Resize
  // ------------------------------------------------------

  /**
   * NOTE: Register resize event for Masonry layout
   */
  const EVENT = document.createEvent('UIEvents');
  window.EVENT = EVENT;
  EVENT.initUIEvent('resize', true, false, window, 0);


  window.addEventListener('load', () => {
    /**
     * Trigger window resize event after page load
     * for recalculation of masonry layout.
     */
    window.dispatchEvent(EVENT);
  });

  // ------------------------------------------------------
  // @External Links
  // ------------------------------------------------------

  // Open external links in new window
  $('a')
    .filter('[href^="http"], [href^="//"]')
    .not(`[href*="${window.location.host}"]`)
    .attr('rel', 'noopener noreferrer')
    .attr('target', '_blank');

  // ------------------------------------------------------
  // @Resize Trigger
  // ------------------------------------------------------

  // Trigger resize on any element click
  document.addEventListener('click', () => {
    window.dispatchEvent(window.EVENT);
  });
}());
