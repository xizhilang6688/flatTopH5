;(function() {
  'use strict';

  var $doc = $(document),
      $body = $('body'),
      questions = {
        bear: {
          'title': '你在森林中独行，突然出现一只黑熊，你该怎么办？',
          'option': ['赶紧跑，跑得比刘翔还快','倒地装死，一动不动','和它说话,让熊知道你没恶意','扔过去食物,然后慢慢撤退'],
          'result': 1
        },
        valley: {
          'title': '被困山里如何快速发出求救信号？',
          'option': ['点燃火堆引起注意','大声呼喊求救','地面上画出SOS符号','自己默默找出路'],
          'result': 0
        },
        seed: {
          'title': '如果允许你带种子去荒山生活，你将选择哪种？',
          'option': ['玉米','马铃薯','葡萄','西红柿'],
          'result': 0
        },
        snake: {
          'title': '以下哪种蛇是毒蛇？',
          'option': ['火赤练蛇','百步蛇','帕布拉奶蛇','翠青蛇'],
          'result': 1
        },
        thunder: {
          'title': '野外露营遇到雷暴天气，怎么做最安全？',
          'option': ['躲到附近的大树下','躲到可以避雨的大石头下','躲在帐篷里不出来','转移到远离树木的低地处'],
          'result': 3
        },
        boating: {
          'title': '你正在河道里划船，什么情景预示洪水要来了？',
          'option': ['天空变得乌黑','水位上涨,水变得混浊','潮湿的风吹过河谷','闻到湿漉漉的味道'],
          'result': 1
        },
        chef: {
          'title': '平顶厨房要开饭啦，你打算为大家做些什么呢？',
          'option': ['鸡棚那只鸡和蘑菇炖了吧','土豆丰收啦,土豆丝最赞','杀头牛来份牛排解解馋','刚收获的鸡蛋都煮了吧'],
          'result': 1
        }
      },
      tmpl = '\
        <div class="loadingAni" style="display:none">\
           <div class="inner">\
            <div class="fengche">\
                <b class="box box1"></b><b class="box box2"></b><b class="box box3"></b><b class="box box4"></b>\
            </div>\
            <h4>生存天数计算中...</h4>\
        </div></div> \
        <div id="animalchanger">\
          <div class="level-one">\
            <div class="wrap left-to-right">\
              <%for(var i = 0; i < shardCount; i++) {%>\
              <div class="shard-wrap"><div class="shard"></div></div>\
              <%}%>\
            </div>\
          </div>\
          <div class="title">\
            <%for(var i = 0; i < titleSubElementCount; i++) {%>\
            <div class="triangle"></div>\
            <%}%>\
            <div class="titleNum num1"></div>\
          </div>\
          <div class="answerList">\
            <h1></h1>\
            <ul>\
              <%for(var i = 0; i < optionsIndex.length; i++) {%>\
              <li data-index="<%=i%>">\
                <span class="abcd"><%=optionsIndex[i]%>.</span>\
                  <p></p>\
                  <span class="check checked"></span>\
              </li>\
              <%}%>\
            </ul>\
          </div>\
          <div class="changePanel"></div>\
          <div class="changePanelinner"></div>\
        </div>\
      '

  // android 貌似都不支持clip-path
  //  && !($.os.android && parseFloat($.os.version) >= 4.4)
  // if(!($.os.ios && parseFloat($.os.version) >= 7.1)) {
  //   $('html').addClass('lowPhone')    
  // }

  var stateTimer = setInterval(function() {
      $body.removeClass("state-four")
      setTimeout(function(){$body.addClass("state-two")},100)
      setTimeout(function(){$body.removeClass("state-two");$body.addClass("state-three")},1100)
      setTimeout(function(){$body.removeClass("state-three");$body.addClass("state-four")},2000)
    }, 3000)

  var shimmerTimer = setInterval(function(){
      setTimeout(function(){$body.addClass("shimmer")},1000)
      setTimeout(function(){$body.removeClass("shimmer")},2520)
    },3520)


  
  // var audioidId = null,audioLen,audioIsPlay=0

  // function audioplay(animal){
  //   if($('.songBox .close').css('display')=="none") return
  //   var name = animal || 'bear'
  //   var musicanimals = {
  //         "bear":[0,5],"valley":[5,10],"seed":[10,15],"snake":[15,20],"thunder":[20,25],"boating":[25,30],"chef":[30,35]
  //   }
  //   audioLen = musicanimals[name][1]
  //   audioidId.currentTime = musicanimals[name][0]
  //   audioidId.play()
  // }
   
  // 开始答题
  $doc.on('startanswer', function() {
    bosszone("clickA","","","","","","",bossOpenId)
    var context = {shardCount: 30, titleSubElementCount: 7, optionsIndex: ['A', 'B', 'C', 'D']},
        html = txTpl(tmpl, context),
        animals = (function() {
          var names = []
          $.each(questions, function(key, value) {
            names.push(key)
          })
          return names
        })()

    $body.html(html).addClass('animal-animations-on')
        
    var t = $(window).width(),
        e = 0.7*t,
        a = -1*(t/2),
        n = -1*(e/2)-0

    $('#animalchanger .wrap').css({width: t, height: e, 'margin-top': n, 'margin-left': a})
    $('#animalchanger .title').css({
      width: Math.round($(window).width()*0.340625),
      height: Math.round($(window).width()*0.340625*0.5),
      bottom: $(window).height()*0.25
    })

    $body.data('animals', animals)
    $body.data('score', 0)
    $body.data('answercount', 0)
    var $animalchanger = $('#animalchanger')
    

    
    // 第一题固定为bear
    var animal = 'bear'
    $animalchanger.trigger('askquestion', {animal: animal})
    // audioidId = document.getElementById('audio')

    // function audioAddEvent(){
    //     if(audioidId.currentTime>audioLen){
    //         audioidId.pause();
    //     }
    // }
    // function checkAudio(){
    //     try{
    //         audioidId.load()
    //         audioidId.addEventListener('durationchange',function(){
    //         if(audioidId.duration && audioidId.duration>30){ 
    //             $(".songBox").show();
    //             audioidId.addEventListener('timeupdate',audioAddEvent,false);
    //             audioplay('bear')
    //             //只执行一次
    //             $("#animalchanger").unbind();
    //        }
    //     },false)  
    //     }catch (e){
    //     }
         
    // }
    // $("#animalchanger").bind('touchstart', function() {
    //     checkAudio()
    // })
    
    // checkAudio()
    // $('.songBox').on('tap',function(){
    //   if($('.songBox .open').css('display')=="none"){
    //     $('.songBox .open').show()
    //     $('.songBox .close').hide()
    //     audioidId.pause()
    //   }else{
    //     $('.songBox .open').hide()
    //     $('.songBox .close').show()
        
    //   }
    // })
    
  })
  
  // 提问
  $doc.on('askquestion', '#animalchanger', function(event, options) {
    var $target = $(this),
        $answerList = $('.answerList', $target),
        $title = $('.title', $target),
        $answertitle = $('.answerList h1', $target),
        $titleNum = $('.title .titleNum', $target),
        $options = $('.answerList p', $target),
        oldAnimal = $body.data('animal'),
        animal = options.animal,
        animals = $body.data('animals'),
        answercount = $body.data('answercount')

    animals.splice(animals.indexOf(animal), 1)
    $body.data('currentAnimal', animal)
    $body.data('animals', animals)
    $body.data('animal', animal)

    $answertitle.text(questions[animal].title)
    $.each(questions[animal].option, function(index, opt) {
      $options.eq(index).text(opt)
    })
    $titleNum.removeClass('num' + answercount).addClass('num' + (answercount + 1))
    $('ul', $answerList).hide()
    $answerList.css({top: $(window).height()*0.72})
    $title.css({bottom: $(window).height()*0.25})
    $('.answerList .current', $answerList).removeClass('current')
    $('.answerList .checked', $answerList).removeClass('checked')
    $('.changePanel', $target).show()
    $('.changePanelinner', $target).show()
    setTimeout(function() {
      $target.removeClass(oldAnimal + 'Two').addClass(animal)
    }, 16)
  })

  // 向上滑动题目回答问题
  $doc.on('swipeUp', '#animalchanger', function(event) {
    var animal = $body.data('animal')
    if(animal.slice(-3) === 'Two') {
      return
    }

    $('#animalchanger').trigger('answerquestion')
  })

  // 选择答案
  $doc.on('answerquestion', '#animalchanger', function(event, options) {
    var $target = $(this),
        animal = $body.data('animal')

    $target.removeClass(animal).addClass(animal + 'Two')
    $('.answerList ul', $target).show()
    $('.answerList', $target).css({top:$(window).height()*0.38})
    $('.title', $target).css({bottom:$(window).height()*0.6})
    $('.changePanel', $target).hide()
    $('.changePanelinner', $target).hide()
  })

  // 回答问题
  $doc.on('tap', '#animalchanger .answerList li', function(event) {
    var $target = $(this),
        $animalchanger = $('#animalchanger'),
        $answerList = $target.parents('.answerList'),
        index = parseInt($target.data('index')),
        animals = $body.data('animals'),
        animal = $body.data('animal'),
        score = parseInt($body.data('score')),
        answercount = $body.data('answercount')

    if($('.current', $answerList).length) {
      return
    }

    $target.addClass('current')
    $('.check', $target).addClass('checked')

    if(questions[animal].result === index) {
      score++
      $body.data('score', score)
    }

    answercount++
    $body.data('answercount', answercount)

    // 完成5道答题
    if(answercount === 5) {
      setTimeout(function(){
        $(".loadingAni").show()
      },1000)
      setTimeout(function(){
        $doc.trigger('showresult')
        return
      },3000)
      return
    }

    var randow = Math.floor(animals.length * Math.random())
    animal = animals[randow]
    setTimeout(function() {
      $animalchanger.trigger('askquestion', {animal: animal})
      // audioidId.pause()
      // audioplay(animal)
        
    }, 500)
  })

  // 禁止页面滚动
  $doc.on('touchmove', '#animalchanger, .loadingPgae', function(event) {
    event.preventDefault()
  })

})()