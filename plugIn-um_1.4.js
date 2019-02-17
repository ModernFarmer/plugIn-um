function _MovingScroll(obj){                          //滚动条插件
    let UM_MovingScroll={
        box:obj.box,
        contentBox:obj.contentBox,
        scrollBox:obj.scrollBox,
        speed:obj.speed,
        position:obj.position || null,
        watch_keyup:obj.watch_keyup || false,
        height_box:function(){
            return parseInt(this.box.getStyle('height'));
        },
        height_content:function(){
            return parseInt(this.contentBox.el.offsetHeight);
        },
        height_scroll:function(){
            return this.height_content()<=this.height_box()?0:Math.ceil((this.height_box()/this.height_content())*this.height_box());
        }
    };
    UM_MovingScroll.contentBox.transition('.5s ease-out');
    setTimeout(function(){
        UM_MovingScroll.scrollBox.transition('.5s ease-out').css({'height':UM_MovingScroll.height_scroll()+'px', 'cursor':'pointer'});       //初始化滚动条高度，必要时需要加定时器
    },500);        
    UM_MovingScroll.box.mousewheel(function(){
        let top_contentBox=parseInt(UM_MovingScroll.contentBox.getStyle('top')) + UM_MovingScroll.speed;
        if(top_contentBox>0 || UM_MovingScroll.height_content()<UM_MovingScroll.height_box())top_contentBox=0;
        if(UM_MovingScroll.height_content()<UM_MovingScroll.height_box())top_contentBox=0;
        UM_MovingScroll.contentBox.transition('.1s ease-out').css('top', top_contentBox+'px');
        let top_scrollBox=-Math.ceil(top_contentBox / (UM_MovingScroll.height_content() - UM_MovingScroll.height_box()) * (UM_MovingScroll.height_box() - UM_MovingScroll.height_scroll()));
        UM_MovingScroll.scrollBox.transition('.5s ease-out').css({'height':UM_MovingScroll.height_scroll()+'px', 'top':top_scrollBox+'px'});
    }, function(){
        let top_contentBox=parseInt(UM_MovingScroll.contentBox.getStyle('top')) - UM_MovingScroll.speed;
        if(top_contentBox<-(UM_MovingScroll.height_content()-UM_MovingScroll.height_box()))top_contentBox=-(UM_MovingScroll.height_content()-UM_MovingScroll.height_box());
        if(UM_MovingScroll.height_content()<UM_MovingScroll.height_box())top_contentBox=0;
        UM_MovingScroll.contentBox.transition('.1s ease-out').css('top', top_contentBox+'px');
        let top_scrollBox=-Math.ceil(top_contentBox / (UM_MovingScroll.height_content() - UM_MovingScroll.height_box()) * (UM_MovingScroll.height_box() - UM_MovingScroll.height_scroll()));
        UM_MovingScroll.scrollBox.transition('.5s ease-out').css({'height':UM_MovingScroll.height_scroll()+'px', 'top':top_scrollBox+'px'});
    });
    UM_MovingScroll.box.BD({mouseenter:function(){
        UM_MovingScroll.scrollBox.transition('1s ease-out').css('opacity', 1);
    }, mouseleave:function(){
        UM_MovingScroll.scrollBox.transition('1s ease-out').css('opacity', .3);
    },click:function(){                                    //默认当点击容器盒子时，执行滚动条盒子的高度自动变化
        setTimeout(function(){
            let top_contentBox=parseInt(UM_MovingScroll.contentBox.getStyle('top'));
            if(top_contentBox>0 || UM_MovingScroll.height_content()<UM_MovingScroll.height_box()){
                top_contentBox=0;
            }else if(top_contentBox<-(UM_MovingScroll.height_content()-UM_MovingScroll.height_box())){
                top_contentBox=-(UM_MovingScroll.height_content()-UM_MovingScroll.height_box());
            }
            if(UM_MovingScroll.height_content()<UM_MovingScroll.height_box())top_contentBox=0;
            UM_MovingScroll.contentBox.transition('.1s ease-out').css('top', top_contentBox+'px');
            let top_scrollBox=-Math.ceil(top_contentBox / (UM_MovingScroll.height_content() - UM_MovingScroll.height_box()) * (UM_MovingScroll.height_box() - UM_MovingScroll.height_scroll()));
            UM_MovingScroll.scrollBox.transition('.5s ease-out').css({'height':UM_MovingScroll.height_scroll()+'px', 'top':top_scrollBox+'px'});
        }, 500);
    }});
    if(obj.watch_keyup===true){                  //当页面上按键抬起时，是否执行滚动条盒子的高度自动变化，根据需要添加该选项
        _(document).BD('keyup', function(){
            setTimeout(function() {
                let top_contentBox=parseInt(UM_MovingScroll.contentBox.getStyle('top')) + UM_MovingScroll.speed;
                if(top_contentBox>0 || UM_MovingScroll.height_content()<UM_MovingScroll.height_box()){
                    top_contentBox=0;
                }else if(top_contentBox<-(UM_MovingScroll.height_content()-UM_MovingScroll.height_box())){
                    top_contentBox=-(UM_MovingScroll.height_content()-UM_MovingScroll.height_box());
                }
                if(UM_MovingScroll.height_content()<UM_MovingScroll.height_box())top_contentBox=0;
                UM_MovingScroll.contentBox.transition('.1s ease-out').css('top', top_contentBox+'px');
                let top_scrollBox=-Math.ceil(top_contentBox / (UM_MovingScroll.height_content() - UM_MovingScroll.height_box()) * (UM_MovingScroll.height_box() - UM_MovingScroll.height_scroll()));
                UM_MovingScroll.scrollBox.transition('.5s ease-out').css({'height':UM_MovingScroll.height_scroll()+'px', 'top':top_scrollBox+'px'});
            }, 500);
        });
    }
    UM_MovingScroll.scrollBox.BD('mousedown', function(event){
        _stopPropagation(event);
        _preventDefault(event);
        let cursor=getClient(event).y;
        let L=cursor-parseInt(UM_MovingScroll.scrollBox.getStyle('top'));
        let runner=function(event){
            let cursor=getClient(event).y;
            let s=cursor-L;
            if(s<0)s=0;
            if(s>parseInt(UM_MovingScroll.box.getStyle('height'))-parseInt(UM_MovingScroll.scrollBox.getStyle('height')))s=parseInt(UM_MovingScroll.box.getStyle('height'))-parseInt(UM_MovingScroll.scrollBox.getStyle('height'));
            let S=-Math.floor(s / (UM_MovingScroll.height_box() - UM_MovingScroll.height_scroll()) * (UM_MovingScroll.height_content() - UM_MovingScroll.height_box()));
            UM_MovingScroll.scrollBox.transition('').css('top', s+'px');
            UM_MovingScroll.contentBox.transition('').css('top', S+'px');
        };
        let stopRun=function(){
            _(document).unBD({mousemove:runner, mouseup:stopRun});
        };
        _(document).BD('mousemove', runner);
        _(document).BD('mouseup', stopRun);
    });
    if(isArray(UM_MovingScroll.position) && UM_MovingScroll.position.length>0){
        for(let i=0; i<UM_MovingScroll.position.length; i++){
            UM_MovingScroll.position[i].clickObj.el.setAttribute('UM_MovingScrollPlugIn', i);
            UM_MovingScroll.position[i].clickObj.BD('click', function(){
                let mark= UM_MovingScroll.position[this.getAttribute('UM_MovingScrollPlugIn')].targetObj.el.offsetTop>(UM_MovingScroll.height_content()-UM_MovingScroll.height_box())?-(UM_MovingScroll.height_content()-UM_MovingScroll.height_box()):-(UM_MovingScroll.position[this.getAttribute('UM_MovingScrollPlugIn')].targetObj.el.offsetTop);
                if(UM_MovingScroll.height_content()<UM_MovingScroll.height_box())mark=0;
                UM_MovingScroll.contentBox.transition('.5s ease-out').css('top', mark+'px');
                UM_MovingScroll.scrollBox.transition('.5s ease-out').css('top', Math.ceil(-mark*UM_MovingScroll.height_scroll()/UM_MovingScroll.height_box())+'px');
            });
        };
    }
};

/*_MovingScroll({                          //滚动条插件    参数：json
    box:_('.box', 0),                   //容器盒子选择器  element       容器盒子不能加任何border、padding和margin相关的任何样式，如有需要可在容器盒子再套一个div来添加样式
    contentBox:_('.content', 0),        //滚动内容盒子选择器  element
    scrollBox:_('.scroll', 0),          //滚动条盒子选择器  element     滚动条盒子不能加任何border、padding和margin相关的任何样式
    speed:50,                           //滚动速度  number
    position:[                          //锚记定位  array   *数组内是各个json对象[json, json, ...]，json内是{clickObj:锚记链接元素，targetObj:锚记书签元素}
                                        //可选项,  默认null
        {clickObj:_('.c1', 0), targetObj:_('.t1', 0)},
        {clickObj:_('.c2', 0), targetObj:_('.t2', 0)},
        {clickObj:_('.c3', 0), targetObj:_('.t3', 0)},
        {clickObj:_('.c4', 0), targetObj:_('.t4', 0)},
        {clickObj:_('.c5', 0), targetObj:_('.t5', 0)}
    ],
    watch_keyup:false                  //当页面上按键抬起时,是否执行滚动条盒子的高度自动变化,可选项,默认false
});*/

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

function _PullDown(obj){                           //下拉内容过渡插件
    let UM_PullDown={
        caption:obj.caption,
        down:obj.down,
        speed:obj.speed || 0.5,
        now:obj.now || false,
        select:obj.select || false,
        D_click:obj.D_click || false,
        choosable:obj.choosable || false,
        height:function(){
            let result=0;
            for(let i=0; i<UM_PullDown.down.el.children.length; i++){
                result+=UM_PullDown.down.el.children[i].offsetHeight;
            };
            return result+'px';
        },
        padding_top:function(){
            return this.down.getStyle('paddingTop');
        },
        padding_bottom:function(){
            return this.down.getStyle('paddingBottom');
        },
        margin_top:function(){
            return this.down.getStyle('marginTop');
        },
        margin_bottom:function(){
            return this.down.getStyle('marginBottom');
        }
    };

    let top_p=UM_PullDown.padding_top();
    let bottom_p=UM_PullDown.padding_bottom();
    let top_m=UM_PullDown.margin_top();
    let bottom_m=UM_PullDown.margin_bottom();

    if(UM_PullDown.now===true)UM_PullDown.down.css({opacity:1, height:UM_PullDown.height(), overflow:'hidden'});
    if(UM_PullDown.now===false)UM_PullDown.down.css({opacity:0, height:0, paddingTop:0, paddingBottom:0, marginTop:0, marginBottom:0, overflow:'hidden'});
    if(UM_PullDown.choosable===false)UM_PullDown.caption.choosable(false);
    UM_PullDown.caption.css('cursor', 'pointer');
    UM_PullDown.caption.BD('click', function(event){
        _stopPropagation(event);
        if(UM_PullDown.now===false){
            UM_PullDown.down.transition(UM_PullDown.speed+'s ease', 'center top').css({opacity:1, height:UM_PullDown.height(), paddingTop:top_p, paddingBottom:bottom_p, marginTop:top_m, marginBottom:bottom_m});
        }else{
            UM_PullDown.down.transition(UM_PullDown.speed+'s ease', 'center top').css({opacity:0, height:0, paddingTop:0, paddingBottom:0, marginTop:0, marginBottom:0});
        };
        UM_PullDown.now=!UM_PullDown.now;
    });
    if(UM_PullDown.D_click===false){
        _(document).BD('click', function(){
            UM_PullDown.down.transition(UM_PullDown.speed+'s ease', 'center top').css({opacity:0, height:0, paddingTop:0, paddingBottom:0, marginTop:0, marginBottom:0});
            UM_PullDown.now=false;
        });
    }
    if(UM_PullDown.select===false){
        UM_PullDown.down.BD('click', function(event){
            _stopPropagation(event);
            UM_PullDown.down.transition(UM_PullDown.speed+'s ease', 'center top').css({opacity:0, height:0, paddingTop:0, paddingBottom:0, marginTop:0, marginBottom:0});
            UM_PullDown.now=false;
        });
    }
};

/*_PullDown({                               //下拉内容过渡插件  参数：json
    caption:_('.caption', 0),             //标题选择器                                         element
    down:_('.down', 0),                   //下拉内容选择器                                     element
    speed:1,                              //速度(在几秒内完成过渡)                             number      [可选, 默认0.5]
    now:false,                            //下拉内容初始状态(false隐藏或者true显示)            boolean     [可选, 默认false]
    select:false,                         //点击下拉框是否隐藏下拉框(false隐藏或者true不隐藏)  boolean     [可选, 默认false]
    D_click:false,                        //点击背景是否隐藏下拉框(false隐藏或者true不隐藏)    boolean     [可选，默认false]
    choosable:false                       //标题选择器内的文字是否可被选中(false不可被选中)    boolean     [可选, 默认false]
});*/

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

function _PullLeft(obj){                           //左拉内容过渡插件
    let UM_PullLeft={
        caption:obj.caption,
        left:obj.left,
        speed:obj.speed || 0.5,
        now:obj.now || false,
        select:obj.select || false,
        D_click:obj.D_click || true,
        choosable:obj.choosable || false,
        width:function(){
            let result=0;
            for(let i=0; i<UM_PullLeft.left.el.children.length; i++){
                result+=UM_PullLeft.left.el.children[i].offsetWidth;
            };
            return result+'px';
        },
        padding_left:function(){
            return this.left.getStyle('paddingLeft');
        },
        padding_right:function(){
            return this.left.getStyle('paddingRight');
        },
        margin_left:function(){
            return this.left.getStyle('marginLeft');
        },
        margin_right:function(){
            return this.left.getStyle('marginRight');
        }
    };
    let left_p=UM_PullLeft.padding_left();
    let right_p=UM_PullLeft.padding_right();
    let left_m=UM_PullLeft.margin_left();
    let right_m=UM_PullLeft.margin_right();
    if(UM_PullLeft.now===true)UM_PullLeft.left.css({opacity:1, width:UM_PullLeft.width(), overflow:'hidden'});
    if(UM_PullLeft.now===false)UM_PullLeft.left.css({opacity:0, width:0, paddingLeft:0, paddingRight:0, marginLeft:0, marginRight:0, overflow:'hidden'});
    if(UM_PullLeft.choosable===false)UM_PullLeft.caption.choosable(false);
    UM_PullLeft.caption.css('cursor', 'pointer');
    UM_PullLeft.caption.BD('click', function(event){
        _stopPropagation(event);
        if(UM_PullLeft.now===false){
            UM_PullLeft.left.transition(UM_PullLeft.speed+'s ease', 'left center').css({opacity:1, width:UM_PullLeft.width(), paddingLeft:left_p, paddingRight:right_p, marginLeft:left_m, marginRight:right_m});
        }else{
            UM_PullLeft.left.transition(UM_PullLeft.speed+'s ease', 'left center').css({opacity:0, width:0, paddingLeft:0, paddingRight:0, marginLeft:0, marginRight:0});
        };
        UM_PullLeft.now=!UM_PullLeft.now;
    });
    if(UM_PullLeft.D_click===true){
        _(document).BD('click', function(){
            UM_PullLeft.left.transition(UM_PullLeft.speed+'s ease', 'left center').css({opacity:0, width:0, paddingLeft:0, paddingRight:0, marginLeft:0, marginRight:0});
            UM_PullLeft.now=false;
        });
    }
    if(UM_PullLeft.select===true){
        UM_PullLeft.left.BD('click', function(event){
            _stopPropagation(event);
            UM_PullLeft.left.transition(UM_PullLeft.speed+'s ease', 'left center').css({opacity:0, width:0, paddingLeft:0, paddingRight:0, marginLeft:0, marginRight:0});
            UM_PullLeft.now=false;
        });
    }
};

/*_PullLeft({                               //左拉内容过渡插件  参数：json
    caption:_('.caption', 0),             //标题选择器                                         element
    left:_('.left', 0),                   //左拉内容选择器                                     element
    speed:1,                              //速度(在几秒内完成过渡)                             number      [可选, 默认0.5]
    now:false,                            //左拉内容初始状态(false隐藏或者true显示)            boolean     [可选, 默认false]
    select:false,                         //点击左拉框是否隐藏左拉框(false隐藏或者true不隐藏)  boolean     [可选, 默认false]
    D_click:false,                        //点击背景是否隐藏左拉框(false隐藏或者true不隐藏)    boolean     [可选，默认false]
    choosable:false                       //标题选择器内的文字是否可被选中(false不可被选中)    boolean     [可选, 默认false]
});*/

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

function _Drag(obj){                        //拖拽插件
  let UM_Drag={
    mousedownBox:obj.mousedownBox,
    dragBox:obj.dragBox || obj.mousedownBox,
    parent:obj.parent || _('body', 0)
  };

  UM_Drag.mousedownBox.BD('mousedown', function(event){
    let Drag_S_left=getClient(event).x-UM_Drag.dragBox.el.offsetLeft;
    let Drag_S_top=getClient(event).y-UM_Drag.dragBox.el.offsetTop;

    let _mousemove=function(event){
      let Drag_left=getClient(event).x-Drag_S_left;
      let Drag_top=getClient(event).y-Drag_S_top;
      if(Drag_left<0){
        Drag_left=0;
      }else if(Drag_left>(UM_Drag.parent.el.offsetWidth-UM_Drag.dragBox.el.offsetWidth)){
        Drag_left=UM_Drag.parent.el.offsetWidth-UM_Drag.dragBox.el.offsetWidth;
      }
      if(Drag_top<0){
        Drag_top=0;
      }else if(Drag_top>(UM_Drag.parent.el.offsetHeight-UM_Drag.dragBox.el.offsetHeight)){
        Drag_top=UM_Drag.parent.el.offsetHeight-UM_Drag.dragBox.el.offsetHeight;
      }
      UM_Drag.dragBox.el.style.left=Drag_left+'px';
      UM_Drag.dragBox.el.style.top=Drag_top+'px';
    };

    let _mouseup=function(){
      _(document).unBD({mousemove:_mousemove, mouseup:_mouseup});
    };

    _(document).BD('mousemove', _mousemove);
    _(document).BD('mouseup', _mouseup);
  });
};

/*_Drag({               //拖拽插件，参数:json
  mousedownBox:_('.aaa', 0),                //被鼠标左键按下后发生拖拽的选择器      element
  dragBox:_('.box', 0),                     //被拖拽主体的选择器                    element       [可选, 默认为mousedownBox]
  parent:_('.bigbox', 0)                    //被拖拽元素的父级选择器                element       [可选, 默认为_('body',0)]
});*/

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

function _showInputImg(json, string){                       //显示<input type="file" id/class="inputName">表单所选择的图片到指定的imgBox
    let UM_ShowInputImg={
        inputName:json.inputName,
        imgBoxName:json.imgBoxName,
        isNotImg:json.isNotImg || null
    };

    let UM_ShowInputImg_str=string||'';

    _(UM_ShowInputImg.imgBoxName, 0).el.innerHTML='';
    let file=_(UM_ShowInputImg.inputName, 0).el.files;
    let imgObj=new Image();
    let UM_ShowInputImg_className='UM_frame_img_custom_classname'+UM_ShowInputImg_str;
    imgObj.className=UM_ShowInputImg_className;               
    if(!isImg(file[0].type)){      //判断所选文件是否为图片文件
        if(UM_ShowInputImg.isNotImg){
            UM_ShowInputImg.isNotImg();
        }
        return;
    };
    let UM_ShowInputImg_url=null;
    if(window.createObjectURL!=undefined){
        UM_ShowInputImg_url=window.createObjectURL(file[0]);          //basic
    }else if(window.URL!=undefined){
        UM_ShowInputImg_url=window.URL.createObjectURL(file[0]);      //firefox
    }else if(window.webkitURL!=undefined){
        UM_ShowInputImg_url=window.webkitURL.createObjectURL(file[0]);   //chrome
    }
    imgObj.src=UM_ShowInputImg_url;

    imgObj.onload=function(){
        _(UM_ShowInputImg.imgBoxName, 0).el.appendChild(imgObj);
        _('.'+UM_ShowInputImg_className, 0).transition('.2s ease').css({opacity:0});
        _('.'+UM_ShowInputImg_className, 0).center();
        let w=_('.'+UM_ShowInputImg_className, 0).el.offsetWidth;
        let h=_('.'+UM_ShowInputImg_className, 0).el.offsetHeight;
        if(parseInt(_(UM_ShowInputImg.imgBoxName, 0).getStyle('width'))/parseInt(_(UM_ShowInputImg.imgBoxName, 0).getStyle('height'))<w/h){
            _('.'+UM_ShowInputImg_className, 0).css({width:parseInt(_(UM_ShowInputImg.imgBoxName, 0).getStyle('width'))*.98+'px', height:parseInt(_(UM_ShowInputImg.imgBoxName, 0).getStyle('width'))*.98*h/w+'px', opacity:1});
        }else if(parseInt(_(UM_ShowInputImg.imgBoxName, 0).getStyle('width'))/parseInt(_(UM_ShowInputImg.imgBoxName, 0).getStyle('height'))>=w/h){
            _('.'+UM_ShowInputImg_className, 0).css({width:parseInt(_(UM_ShowInputImg.imgBoxName, 0).getStyle('height'))*.98*w/h+'px', height:parseInt(_(UM_ShowInputImg.imgBoxName, 0).getStyle('height'))*.98+'px', opacity:1});
        }
    };
};

/*_showInputImg({
    inputName:'#input',             //<input type="file">表单的选择器名字
    imgBoxName:'.box',                  //显示图片的容器的选择器名字
    isNotImg:function(){            //如果所选的不是图片类型的文件的回调函数[可选]     默认为null
        //todo...
    }
}, string);                    //string:   如果同一页面有多个该插件, 则可以添加第三个参数区分开生成的图片的className   */

function _showingImg(asDomName, url, string){                       //按比例显示图片
    let UM_showingImg_um=_(asDomName, 0);
    let UM_showingImg_dom=_(asDomName, 0).el;
    let UM_showingImg_str=string||'';
    let UM_showingImg_name_class='UM_frame_simpleImg_custom_classname'+UM_showingImg_str;
    UM_showingImg_dom.innerHTML='';
    let imgObj=new Image();
    imgObj.className=UM_showingImg_name_class;
    imgObj.src=url;
    imgObj.onload=function(){
        UM_showingImg_dom.appendChild(imgObj);
        _('.'+UM_showingImg_name_class, 0).transition('.2s ease').css({opacity:0});
        _('.'+UM_showingImg_name_class, 0).center();
        let UM_showingImg_w=_('.'+UM_showingImg_name_class, 0).el.offsetWidth;
        let UM_showingImg_h=_('.'+UM_showingImg_name_class, 0).el.offsetHeight;
        if(parseInt(UM_showingImg_um.getStyle('width'))/parseInt(UM_showingImg_um.getStyle('height'))<UM_showingImg_w/UM_showingImg_h){
            if(ifDom(asDomName))_('.'+UM_showingImg_name_class, 0).css({width:parseInt(UM_showingImg_um.getStyle('width'))*.98+'px', height:parseInt(UM_showingImg_um.getStyle('width'))*.98*UM_showingImg_h/UM_showingImg_w+'px', opacity:1});
        }else if(parseInt(UM_showingImg_um.getStyle('width'))/parseInt(UM_showingImg_um.getStyle('height'))>=UM_showingImg_w/UM_showingImg_h){
            if(ifDom(asDomName))_('.'+UM_showingImg_name_class, 0).css({width:parseInt(UM_showingImg_um.getStyle('height'))*.98*UM_showingImg_w/UM_showingImg_h+'px', height:parseInt(UM_showingImg_um.getStyle('height'))*.98+'px', opacity:1});
        }
    }
};

//_showingImg(asDomName, url, string)    //asDomName:  容器选择器   _('.xxxx', 0)
                          //url: 图片地址
                          //string:   如果同一页面有多个该插件, 则可以添加第三个参数区分开生成的图片的className

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

function _touchUpAndDown(UM_Obj){                    //移动端上下滑动推拽插件
    let UM_touchUpAndDown={
        dragBox:_(UM_Obj.dragBox, 0),
        parent:_(UM_Obj.parent, 0)
    };
    let UM_clientY_1=null;
    let UM_clientY_2=null;
    let UM_domScrollTop=null;
    let UM_lengthTop=null;

    UM_touchUpAndDown.dragBox.BD('touchstart', function(){
        UM_domScrollTop=UM_touchUpAndDown.dragBox.el.offsetTop;
        UM_clientY_1=event.targetTouches[0].clientY;
        UM_lengthTop=UM_clientY_1-UM_domScrollTop;
        _(document).BD('touchmove', function(){
            UM_clientY_2=event.targetTouches[0].clientY;
            let UM_S=(UM_clientY_2-UM_lengthTop)+'px';
            UM_touchUpAndDown.dragBox.css({top:UM_S});
            if(parseFloat(UM_touchUpAndDown.dragBox.getStyle('top'))>0)UM_touchUpAndDown.dragBox.css('top', 0);
            if(parseFloat(UM_touchUpAndDown.dragBox.getStyle('top'))<(UM_touchUpAndDown.parent.el.offsetHeight-UM_touchUpAndDown.dragBox.el.offsetHeight))UM_touchUpAndDown.dragBox.css({top:(UM_touchUpAndDown.parent.el.offsetHeight-UM_touchUpAndDown.dragBox.el.offsetHeight)+'px'});
        });
        _(document).BD('touchend', function(){
            UM_clientY_1=null;
            UM_clientY_2=null;
            UM_domScrollTop=null;
            UM_lengthTop=null;
            return;
        });
    });
};

/*_touchUpAndDown({
    dragBox:'.contentBox',           //被滑动拖拽主体      选择器字符串
    parent:'.box'                    //容器                选择器字符串
});*/

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

function _touchLeftAndRight(UM_Obj){                    //移动端左右滑动推拽插件
    let _touchLeftAndRight={
        dragBox:_(UM_Obj.dragBox, 0),
        parent:_(UM_Obj.parent, 0)
    };
    let UM_clientX_1=null;
    let UM_clientX_2=null;
    let UM_domScrollLeft=null;
    let UM_lengthLeft=null;

    _touchLeftAndRight.dragBox.BD('touchstart', function(){
        UM_domScrollLeft=_touchLeftAndRight.dragBox.el.offsetLeft;
        UM_clientX_1=event.targetTouches[0].clientX;
        UM_lengthLeft=UM_clientX_1-UM_domScrollLeft;
        _(document).BD('touchmove', function(){
            UM_clientX_2=event.targetTouches[0].clientX;
            let UM_S=(UM_clientX_2-UM_lengthLeft)+'px';
            _touchLeftAndRight.dragBox.css({left:UM_S});
            if(parseFloat(_touchLeftAndRight.dragBox.getStyle('left'))>0)_touchLeftAndRight.dragBox.css('left', 0);
            if(parseFloat(_touchLeftAndRight.dragBox.getStyle('left'))<(_touchLeftAndRight.parent.el.offsetWidth-_touchLeftAndRight.dragBox.el.offsetWidth))_touchLeftAndRight.dragBox.css({left:(_touchLeftAndRight.parent.el.offsetWidth-_touchLeftAndRight.dragBox.el.offsetWidth)+'px'});
        });
        _(document).BD('touchend', function(){
            UM_clientX_1=null;
            UM_clientX_2=null;
            UM_domScrollLeft=null;
            UM_lengthLeft=null;
            return;
        });
    });
};

/*_touchLeftAndRight({
    dragBox:'.contentBox',           //被滑动拖拽主体      选择器字符串
    parent:'.box'                    //容器                选择器字符串
});*/