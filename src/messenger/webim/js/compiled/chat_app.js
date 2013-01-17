/*
 This file is part of Mibew Messenger project.
 http://mibew.org
 Copyright (c) 2005-2011 Mibew Messenger Community
 License: http://mibew.org/license.php
*/
(function(a){a.Regions={};a.Objects.Models.Controls={};a.Objects.Models.Status={}})(Mibew);
(function(b){b.registerHelper("allowTags",function(a){a=a.replace(/&lt;(span|strong)&gt;(.*?)&lt;\/\1&gt;/g,"<$1>$2</$1>");a=a.replace(/&lt;span class=&quot;(.*?)&quot;&gt;(.*?)&lt;\/span&gt;/g,'<span class="$1">$2</span>');return new b.SafeString(a)})})(Handlebars);
MibewAPIChatInteraction=function(){this.obligatoryArguments={"*":{threadId:null,token:null,"return":{},references:{}},result:{errorCode:0}};this.reservedFunctionNames=["result"]};MibewAPIChatInteraction.prototype=new MibewAPIInteraction;
(function(b,c){b.Models.Status=b.Models.Base.extend({defaults:{visible:!0,weight:0,hideTimeout:4E3,title:""},initialize:function(){this.hideTimer=null},autoHide:function(a){a=a||this.get("hideTimeout");this.hideTimer&&clearTimeout(this.hideTimer);this.hideTimer=setTimeout(c.bind(function(){this.set({visible:!1})},this),a)}})})(Mibew,_);
(function(a,b){a.Models.Avatar=a.Models.Base.extend({defaults:{imageLink:!1},initialize:function(){a.Objects.server.registerFunction("setupAvatar",b.bind(this.apiSetupAvatar,this))},apiSetupAvatar:function(a){a.imageLink&&this.set({imageLink:a.imageLink})}})})(Mibew,_);
(function(a){a.Models.CloseControl=a.Models.Control.extend({getModelType:function(){return"CloseControl"},closeThread:function(){var b=a.Objects.thread;a.Objects.server.callFunctions([{"function":"close",arguments:{references:{},"return":{closed:"closed"},threadId:b.threadId,token:b.token,lastId:b.lastId,user:!a.Objects.Models.user.get("isAgent")}}],function(b){b.closed?window.close():a.Objects.Models.Status.message.setMessage(b.errorMessage||"Cannot close")},!0)}})})(Mibew);
(function(a,b){a.Models.HistoryControl=a.Models.Control.extend({defaults:b.extend({},a.Models.Control.prototype.defaults,{link:!1}),getModelType:function(){return"HistoryControl"}})})(Mibew,_);
(function(a,b){a.Models.RedirectControl=a.Models.Control.extend({defaults:b.extend({},a.Models.Control.prototype.defaults,{link:!1}),getModelType:function(){return"RedirectControl"}})})(Mibew,_);
(function(a){a.Models.RefreshControl=a.Models.Control.extend({getModelType:function(){return"RefreshControl"},refresh:function(){a.Objects.server.restartUpdater()}})})(Mibew);
(function(a,b){a.Models.SecureModeControl=a.Models.Control.extend({defaults:b.extend({},a.Models.Control.prototype.defaults,{link:!1}),getModelType:function(){return"SecureModeControl"}})})(Mibew,_);
(function(a,b){a.Models.SendMailControl=a.Models.Control.extend({defaults:b.extend({},a.Models.Control.prototype.defaults,{link:!1}),getModelType:function(){return"SendMailControl"}})})(Mibew,_);
(function(a,b){a.Models.SoundControl=a.Models.Control.extend({defaults:b.extend({},a.Models.Control.prototype.defaults,{enabled:!0}),getModelType:function(){return"SoundControl"}})})(Mibew,_);
(function(b){b.Models.UserNameControl=b.Models.Control.extend({getModelType:function(){return"UserNameControl"},changeName:function(a){var c=b.Objects.Models.user,d=b.Objects.thread,e=c.get("name");a&&e!=a&&(b.Objects.server.callFunctions([{"function":"rename",arguments:{references:{},"return":{},threadId:d.threadId,token:d.token,name:a}}],function(a){a.errorCode&&(b.Objects.Models.Status.message.setMessage(a.errorMessage||"Cannot rename"),c.set({name:e}))},!0),c.set({name:a}))}})})(Mibew);
(function(a){a.Models.Message=a.Models.Base.extend({defaults:{message:""}})})(Mibew);
(function(a){a.Models.MessageForm=a.Models.Base.extend({defaults:{predefinedAnswers:[],ignoreCtrl:!1},postMessage:function(e){var b=a.Objects.thread,c=a.Objects.Models.user;if(c.get("canPost")){this.trigger("before:post",this);var d=this;a.Objects.server.callFunctions([{"function":"post",arguments:{references:{},"return":{},message:e,threadId:b.threadId,token:b.token,user:!c.get("isAgent")}}],function(){d.trigger("after:post",d)},!0)}}})})(Mibew);
(function(a,b){a.Models.StatusMessage=a.Models.Status.extend({defaults:b.extend({},a.Models.Status.prototype.defaults,{message:"",visible:!1}),getModelType:function(){return"StatusMessage"},setMessage:function(a){this.set({message:a,visible:!0});this.autoHide()}})})(Mibew,_);
(function(a,b){a.Models.StatusTyping=a.Models.Status.extend({defaults:b.extend({},a.Models.Status.prototype.defaults,{visible:!1,hideTimeout:2E3}),getModelType:function(){return"StatusTyping"},show:function(){this.set({visible:!0});this.autoHide()}})})(Mibew,_);
(function(b,d,c){b.Collections.Messages=d.Collection.extend({model:b.Models.Message,initialize:function(){b.Objects.server.callFunctionsPeriodically(c.bind(this.updateFunctionBuilder,this),c.bind(this.updateChatState,this));b.Objects.server.registerFunction("updateMessages",c.bind(this.apiUpdateMessages,this))},apiUpdateMessages:function(a){a.lastId&&(b.Objects.thread.lastId=a.lastId);for(var e=[],c=0,d=a.messages.length;c<d;c++)e.push(new b.Models.Message(a.messages[c]));0<e.length&&this.add(e)},
updateFunctionBuilder:function(){var a=b.Objects.thread,c=b.Objects.Models.user;return[{"function":"update",arguments:{"return":{typing:"typing",canPost:"canPost"},references:{},threadId:a.threadId,token:a.token,lastId:a.lastId,typed:c.get("typing"),user:!c.get("isAgent")}}]},updateChatState:function(a){a.errorCode?b.Objects.Models.Status.message.setMessage(a.errorMessage||"refresh failed"):(a.typing&&b.Objects.Models.Status.typing.show(),b.Objects.Models.user.set({canPost:a.canPost||!1}))},add:function(){var a=
Array.prototype.slice.apply(arguments),a=d.Collection.prototype.add.apply(this,a);this.trigger("multiple:add");return a}})})(Mibew,Backbone,_);
(function(a,b){a.Collections.Status=b.Collection.extend({comparator:function(a){return a.get("weight")}})})(Mibew,Backbone);
(function(a,b,c){a.Views.Status=b.Marionette.ItemView.extend({template:c.templates.status,className:"status",modelEvents:{change:"render"},onBeforeRender:function(){this.model.get("visible")?this.$el.show():this.$el.hide()}})})(Mibew,Backbone,Handlebars);
(function(a,b,c){a.Views.Avatar=b.Marionette.ItemView.extend({template:c.templates.avatar,className:"avatar",modelEvents:{change:"render"}})})(Mibew,Backbone,Handlebars);
(function(a,c,d){a.Views.CloseControl=a.Views.Control.extend({template:c.templates.close_control,events:d.extend({},a.Views.Control.prototype.events,{click:"close"}),close:function(){var b=a.Localization.get("chat.close.confirmation");(!1===b||confirm(b))&&this.model.closeThread()}})})(Mibew,Handlebars,_);
(function(b,d,e){b.Views.HistoryControl=b.Views.Control.extend({template:d.templates.history_control,events:e.extend({},b.Views.Control.prototype.events,{click:"showHistory"}),showHistory:function(){var c=b.Objects.Models.user,a=this.model.get("link");c.get("isAgent")&&a&&(c=this.$el.find(".control-config").eq(0).data("win-params"),a=a.replace("&amp;","&","g"),a=window.open(a,"UserHistory",c),null!==a&&(a.focus(),a.opener=window))}})})(Mibew,Handlebars,_);
(function(a,d,e){a.Views.RedirectControl=a.Views.Control.extend({template:d.templates.redirect_control,events:e.extend({},a.Views.Control.prototype.events,{click:"redirect"}),initialize:function(){a.Objects.Models.user.on("change",this.render,this)},serializeData:function(){var b=this.model.toJSON();b.user=a.Objects.Models.user.toJSON();return b},redirect:function(){var b=a.Objects.Models.user;if(b.get("isAgent")&&b.get("canPost")&&(b=this.model.get("link"))){var c=a.Objects.Models.page.get("style");
window.location.href=b.replace(/\&amp\;/g,"&")+(c?"&style="+c:"")}}})})(Mibew,Handlebars,_);
(function(a,b,c){a.Views.RefreshControl=a.Views.Control.extend({template:b.templates.refresh_control,events:c.extend({},a.Views.Control.prototype.events,{click:"refresh"}),refresh:function(){this.model.refresh()}})})(Mibew,Handlebars,_);
(function(a,d,e){a.Views.SecureModeControl=a.Views.Control.extend({template:d.templates.secure_mode_control,events:e.extend({},a.Views.Control.prototype.events,{click:"secure"}),secure:function(){var b=this.model.get("link");if(b){var c=a.Objects.Models.page.get("style");window.location.href=b.replace(/\&amp\;/g,"&")+(c?"&style="+c:"")}}})})(Mibew,Handlebars,_);
(function(b,c,e){b.Views.SendMailControl=b.Views.Control.extend({template:c.templates.send_mail_control,events:e.extend({},b.Views.Control.prototype.events,{click:"sendMail"}),sendMail:function(){var a=this.model.get("link");if(a){var c=this.$el.find(".control-config").eq(0).data("win-params"),d=b.Objects.Models.page.get("style"),a=a.replace(/\&amp\;/g,"&")+(d?"&style="+d:""),a=window.open(a,"ForwardMail",c);null!==a&&(a.focus(),a.opener=window)}}})})(Mibew,Handlebars,_);
(function(a,b,c){a.Views.SoundControl=a.Views.Control.extend({template:b.templates.sound_control,events:c.extend({},a.Views.Control.prototype.events,{click:"toggle"}),toggle:function(){this.model.set({enabled:!this.model.get("enabled")})}})})(Mibew,Handlebars,_);
(function(b,c,d){b.Views.UserNameControl=b.Views.Control.extend({template:c.templates.user_name_control,events:d.extend({},b.Views.Control.prototype.events,{"click .user-name-control-set":"changeName","click .user-name-control-change":"showNameInput","keydown #user-name-control-input":"inputKeyDown"}),ui:{nameInput:"#user-name-control-input"},initialize:function(){b.Objects.Models.user.on("change:name",this.hideNameInput,this);this.nameInput=b.Objects.Models.user.get("defaultName")},serializeData:function(){var a=
this.model.toJSON();a.user=b.Objects.Models.user.toJSON();a.nameInput=this.nameInput;return a},inputKeyDown:function(a){a=a.which;(13==a||10==a)&&this.changeName()},hideNameInput:function(){this.nameInput=!1;this.render()},showNameInput:function(){this.nameInput=!0;this.render()},changeName:function(){var a=this.ui.nameInput.val();this.model.changeName(a)}})})(Mibew,Handlebars,_);
(function(c,d,e){var f={"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},g=/[&<>'"`]/g;c.Views.Message=d.Marionette.ItemView.extend({template:e.templates.message,className:"message",modelEvents:{change:"render"},serializeData:function(){var a=this.model.toJSON(),b=this.model.get("kind");a.allowFormatting=b!=this.KIND_USER&&b!=this.KIND_AGENT;a.kindName=this.kindToString(b);a.message=this.escapeString(a.message);return a},kindToString:function(a){return a==this.KIND_USER?"user":
a==this.KIND_AGENT?"agent":a==this.KIND_FOR_AGENT?"hidden":a==this.KIND_INFO?"inf":a==this.KIND_CONN?"conn":a==this.KIND_EVENTS?"event":""},escapeString:function(a){return a.replace(g,function(a){return f[a]||"&amp;"})},KIND_USER:1,KIND_AGENT:2,KIND_FOR_AGENT:3,KIND_INFO:4,KIND_CONN:5,KIND_EVENTS:6,KIND_AVATAR:7})})(Mibew,Backbone,Handlebars);
(function(b,d,e){b.Views.MessageForm=d.Marionette.ItemView.extend({template:e.templates.message_form,events:{"click #send-message":"postMessage","keydown #message-input":"messageKeyDown","keyup #message-input":"checkUserTyping","change #message-input":"checkUserTyping","change #predefined":"selectPredefinedAnswer","focus #message-input":"setFocus","blur #message-input":"dropFocus"},modelEvents:{change:"render"},ui:{message:"#message-input",send:"#send-message",predefinedAnswer:"#predefined"},initialize:function(){b.Objects.Models.user.on("change:canPost",
this.render,this)},serializeData:function(){var a=this.model.toJSON();a.user=b.Objects.Models.user.toJSON();return a},postMessage:function(){var a=this.ui.message.val();""!=a&&(this.disableInput(),this.model.postMessage(a));b.Objects.Collections.messages.on("multiple:add",this.postMessageComplete,this)},messageKeyDown:function(a){var c=a.which;a=a.ctrlKey;(13==c&&(a||this.model.get("ignoreCtrl"))||10==c)&&this.postMessage()},enableInput:function(){this.ui.message.removeAttr("disabled")},disableInput:function(){this.ui.message.attr("disabled",
"disabled")},clearInput:function(){this.ui.message.val("").change()},postMessageComplete:function(){this.clearInput();this.enableInput();this.focused&&this.ui.focus();b.Objects.Collections.messages.off("multiple:add",this.postMessageComplete,this)},selectPredefinedAnswer:function(){var a=this.ui.message,c=this.ui.predefinedAnswer,b=c.get(0).selectedIndex;b&&(a.val(this.model.get("predefinedAnswers")[b-1].full).change(),a.focus(),c.get(0).selectedIndex=0)},checkUserTyping:function(){var a=b.Objects.Models.user,
c=""!=this.ui.message.val();c!=a.get("typing")&&a.set({typing:c})},setFocus:function(){this.focused=!0},dropFocus:function(){this.focused=!1}})})(Mibew,Backbone,Handlebars);
(function(a){a.Views.MessagesCollection=a.Views.CollectionBase.extend({itemView:a.Views.Message,className:"messages-collection",initialize:function(){this.collection.on("multiple:add",this.messagesAdded,this);a.Objects.Models.messageForm.on("before:post",this.messagePost,this)},skipNextSound:!0,messagePost:function(){this.skipNextSound=!0},messagesAdded:function(){if(!this.skipNextSound&&a.Objects.Models.Controls.sound.get("enabled")){var b=a.Objects.Models.page.get("webimRoot");b&&a.Objects.Models.sound.play(b+
"/sounds/new_message.wav")}this.skipNextSound=!1}})})(Mibew);
(function(a,b){a.Views.StatusMessage=a.Views.Status.extend({template:b.templates.status_message})})(Mibew,Handlebars);
(function(a){a.Views.StatusCollection=a.Views.CollectionBase.extend({itemView:a.Views.Status,className:"status-collection"})})(Mibew);
(function(a,b){a.Views.StatusTyping=a.Views.Status.extend({template:b.templates.status_typing})})(Mibew,Handlebars);
(function(b,c){b.Models.Status=b.Models.Base.extend({defaults:{visible:!0,weight:0,hideTimeout:4E3,title:""},initialize:function(){this.hideTimer=null},autoHide:function(a){a=a||this.get("hideTimeout");this.hideTimer&&clearTimeout(this.hideTimer);this.hideTimer=setTimeout(c.bind(function(){this.set({visible:!1})},this),a)}})})(Mibew,_);
(function(a,b,c){a.Views.Status=b.Marionette.ItemView.extend({template:c.templates.status,className:"status",modelEvents:{change:"render"},onBeforeRender:function(){this.model.get("visible")?this.$el.show():this.$el.hide()}})})(Mibew,Backbone,Handlebars);
(function(b,d,c){b.Collections.Messages=d.Collection.extend({model:b.Models.Message,initialize:function(){b.Objects.server.callFunctionsPeriodically(c.bind(this.updateFunctionBuilder,this),c.bind(this.updateChatState,this));b.Objects.server.registerFunction("updateMessages",c.bind(this.apiUpdateMessages,this))},apiUpdateMessages:function(a){a.lastId&&(b.Objects.thread.lastId=a.lastId);for(var e=[],c=0,d=a.messages.length;c<d;c++)e.push(new b.Models.Message(a.messages[c]));0<e.length&&this.add(e)},
updateFunctionBuilder:function(){var a=b.Objects.thread,c=b.Objects.Models.user;return[{"function":"update",arguments:{"return":{typing:"typing",canPost:"canPost"},references:{},threadId:a.threadId,token:a.token,lastId:a.lastId,typed:c.get("typing"),user:!c.get("isAgent")}}]},updateChatState:function(a){a.errorCode?b.Objects.Models.Status.message.setMessage(a.errorMessage||"refresh failed"):(a.typing&&b.Objects.Models.Status.typing.show(),b.Objects.Models.user.set({canPost:a.canPost||!1}))},add:function(){var a=
Array.prototype.slice.apply(arguments),a=d.Collection.prototype.add.apply(this,a);this.trigger("multiple:add");return a}})})(Mibew,Backbone,_);
(function(a,b){a.Collections.Status=b.Collection.extend({comparator:function(a){return a.get("weight")}})})(Mibew,Backbone);
(function(a,b){a.Models.Avatar=a.Models.Base.extend({defaults:{imageLink:!1},initialize:function(){a.Objects.server.registerFunction("setupAvatar",b.bind(this.apiSetupAvatar,this))},apiSetupAvatar:function(a){a.imageLink&&this.set({imageLink:a.imageLink})}})})(Mibew,_);
(function(a){a.Models.CloseControl=a.Models.Control.extend({getModelType:function(){return"CloseControl"},closeThread:function(){var b=a.Objects.thread;a.Objects.server.callFunctions([{"function":"close",arguments:{references:{},"return":{closed:"closed"},threadId:b.threadId,token:b.token,lastId:b.lastId,user:!a.Objects.Models.user.get("isAgent")}}],function(b){b.closed?window.close():a.Objects.Models.Status.message.setMessage(b.errorMessage||"Cannot close")},!0)}})})(Mibew);
(function(a,b){a.Models.HistoryControl=a.Models.Control.extend({defaults:b.extend({},a.Models.Control.prototype.defaults,{link:!1}),getModelType:function(){return"HistoryControl"}})})(Mibew,_);
(function(a,b){a.Models.RedirectControl=a.Models.Control.extend({defaults:b.extend({},a.Models.Control.prototype.defaults,{link:!1}),getModelType:function(){return"RedirectControl"}})})(Mibew,_);
(function(a){a.Models.RefreshControl=a.Models.Control.extend({getModelType:function(){return"RefreshControl"},refresh:function(){a.Objects.server.restartUpdater()}})})(Mibew);
(function(a,b){a.Models.SecureModeControl=a.Models.Control.extend({defaults:b.extend({},a.Models.Control.prototype.defaults,{link:!1}),getModelType:function(){return"SecureModeControl"}})})(Mibew,_);
(function(a,b){a.Models.SendMailControl=a.Models.Control.extend({defaults:b.extend({},a.Models.Control.prototype.defaults,{link:!1}),getModelType:function(){return"SendMailControl"}})})(Mibew,_);
(function(a,b){a.Models.SoundControl=a.Models.Control.extend({defaults:b.extend({},a.Models.Control.prototype.defaults,{enabled:!0}),getModelType:function(){return"SoundControl"}})})(Mibew,_);
(function(b){b.Models.UserNameControl=b.Models.Control.extend({getModelType:function(){return"UserNameControl"},changeName:function(a){var c=b.Objects.Models.user,d=b.Objects.thread,e=c.get("name");a&&e!=a&&(b.Objects.server.callFunctions([{"function":"rename",arguments:{references:{},"return":{},threadId:d.threadId,token:d.token,name:a}}],function(a){a.errorCode&&(b.Objects.Models.Status.message.setMessage(a.errorMessage||"Cannot rename"),c.set({name:e}))},!0),c.set({name:a}))}})})(Mibew);
(function(a){a.Models.Message=a.Models.Base.extend({defaults:{message:""}})})(Mibew);
(function(a){a.Models.MessageForm=a.Models.Base.extend({defaults:{predefinedAnswers:[],ignoreCtrl:!1},postMessage:function(e){var b=a.Objects.thread,c=a.Objects.Models.user;if(c.get("canPost")){this.trigger("before:post",this);var d=this;a.Objects.server.callFunctions([{"function":"post",arguments:{references:{},"return":{},message:e,threadId:b.threadId,token:b.token,user:!c.get("isAgent")}}],function(){d.trigger("after:post",d)},!0)}}})})(Mibew);
(function(a,b){a.Models.StatusMessage=a.Models.Status.extend({defaults:b.extend({},a.Models.Status.prototype.defaults,{message:"",visible:!1}),getModelType:function(){return"StatusMessage"},setMessage:function(a){this.set({message:a,visible:!0});this.autoHide()}})})(Mibew,_);
(function(a,b){a.Models.StatusTyping=a.Models.Status.extend({defaults:b.extend({},a.Models.Status.prototype.defaults,{visible:!1,hideTimeout:2E3}),getModelType:function(){return"StatusTyping"},show:function(){this.set({visible:!0});this.autoHide()}})})(Mibew,_);
(function(a,b){a.Regions.Messages=b.Marionette.Region.extend({el:"#messages-region",onShow:function(a){a.on("after:item:added",this.scrollToBottom,this)},scrollToBottom:function(){this.$el.scrollTop(this.$el.prop("scrollHeight"))}})})(Mibew,Backbone);
(function(a,b,c){a.Views.Avatar=b.Marionette.ItemView.extend({template:c.templates.avatar,className:"avatar",modelEvents:{change:"render"}})})(Mibew,Backbone,Handlebars);
(function(a,c,d){a.Views.CloseControl=a.Views.Control.extend({template:c.templates.close_control,events:d.extend({},a.Views.Control.prototype.events,{click:"close"}),close:function(){var b=a.Localization.get("chat.close.confirmation");(!1===b||confirm(b))&&this.model.closeThread()}})})(Mibew,Handlebars,_);
(function(b,d,e){b.Views.HistoryControl=b.Views.Control.extend({template:d.templates.history_control,events:e.extend({},b.Views.Control.prototype.events,{click:"showHistory"}),showHistory:function(){var c=b.Objects.Models.user,a=this.model.get("link");c.get("isAgent")&&a&&(c=this.$el.find(".control-config").eq(0).data("win-params"),a=a.replace("&amp;","&","g"),a=window.open(a,"UserHistory",c),null!==a&&(a.focus(),a.opener=window))}})})(Mibew,Handlebars,_);
(function(a,d,e){a.Views.RedirectControl=a.Views.Control.extend({template:d.templates.redirect_control,events:e.extend({},a.Views.Control.prototype.events,{click:"redirect"}),initialize:function(){a.Objects.Models.user.on("change",this.render,this)},serializeData:function(){var b=this.model.toJSON();b.user=a.Objects.Models.user.toJSON();return b},redirect:function(){var b=a.Objects.Models.user;if(b.get("isAgent")&&b.get("canPost")&&(b=this.model.get("link"))){var c=a.Objects.Models.page.get("style");
window.location.href=b.replace(/\&amp\;/g,"&")+(c?"&style="+c:"")}}})})(Mibew,Handlebars,_);
(function(a,b,c){a.Views.RefreshControl=a.Views.Control.extend({template:b.templates.refresh_control,events:c.extend({},a.Views.Control.prototype.events,{click:"refresh"}),refresh:function(){this.model.refresh()}})})(Mibew,Handlebars,_);
(function(a,d,e){a.Views.SecureModeControl=a.Views.Control.extend({template:d.templates.secure_mode_control,events:e.extend({},a.Views.Control.prototype.events,{click:"secure"}),secure:function(){var b=this.model.get("link");if(b){var c=a.Objects.Models.page.get("style");window.location.href=b.replace(/\&amp\;/g,"&")+(c?"&style="+c:"")}}})})(Mibew,Handlebars,_);
(function(b,c,e){b.Views.SendMailControl=b.Views.Control.extend({template:c.templates.send_mail_control,events:e.extend({},b.Views.Control.prototype.events,{click:"sendMail"}),sendMail:function(){var a=this.model.get("link");if(a){var c=this.$el.find(".control-config").eq(0).data("win-params"),d=b.Objects.Models.page.get("style"),a=a.replace(/\&amp\;/g,"&")+(d?"&style="+d:""),a=window.open(a,"ForwardMail",c);null!==a&&(a.focus(),a.opener=window)}}})})(Mibew,Handlebars,_);
(function(a,b,c){a.Views.SoundControl=a.Views.Control.extend({template:b.templates.sound_control,events:c.extend({},a.Views.Control.prototype.events,{click:"toggle"}),toggle:function(){this.model.set({enabled:!this.model.get("enabled")})}})})(Mibew,Handlebars,_);
(function(b,c,d){b.Views.UserNameControl=b.Views.Control.extend({template:c.templates.user_name_control,events:d.extend({},b.Views.Control.prototype.events,{"click .user-name-control-set":"changeName","click .user-name-control-change":"showNameInput","keydown #user-name-control-input":"inputKeyDown"}),ui:{nameInput:"#user-name-control-input"},initialize:function(){b.Objects.Models.user.on("change:name",this.hideNameInput,this);this.nameInput=b.Objects.Models.user.get("defaultName")},serializeData:function(){var a=
this.model.toJSON();a.user=b.Objects.Models.user.toJSON();a.nameInput=this.nameInput;return a},inputKeyDown:function(a){a=a.which;(13==a||10==a)&&this.changeName()},hideNameInput:function(){this.nameInput=!1;this.render()},showNameInput:function(){this.nameInput=!0;this.render()},changeName:function(){var a=this.ui.nameInput.val();this.model.changeName(a)}})})(Mibew,Handlebars,_);
(function(c,d,e){var f={"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},g=/[&<>'"`]/g;c.Views.Message=d.Marionette.ItemView.extend({template:e.templates.message,className:"message",modelEvents:{change:"render"},serializeData:function(){var a=this.model.toJSON(),b=this.model.get("kind");a.allowFormatting=b!=this.KIND_USER&&b!=this.KIND_AGENT;a.kindName=this.kindToString(b);a.message=this.escapeString(a.message);return a},kindToString:function(a){return a==this.KIND_USER?"user":
a==this.KIND_AGENT?"agent":a==this.KIND_FOR_AGENT?"hidden":a==this.KIND_INFO?"inf":a==this.KIND_CONN?"conn":a==this.KIND_EVENTS?"event":""},escapeString:function(a){return a.replace(g,function(a){return f[a]||"&amp;"})},KIND_USER:1,KIND_AGENT:2,KIND_FOR_AGENT:3,KIND_INFO:4,KIND_CONN:5,KIND_EVENTS:6,KIND_AVATAR:7})})(Mibew,Backbone,Handlebars);
(function(b,d,e){b.Views.MessageForm=d.Marionette.ItemView.extend({template:e.templates.message_form,events:{"click #send-message":"postMessage","keydown #message-input":"messageKeyDown","keyup #message-input":"checkUserTyping","change #message-input":"checkUserTyping","change #predefined":"selectPredefinedAnswer","focus #message-input":"setFocus","blur #message-input":"dropFocus"},modelEvents:{change:"render"},ui:{message:"#message-input",send:"#send-message",predefinedAnswer:"#predefined"},initialize:function(){b.Objects.Models.user.on("change:canPost",
this.render,this)},serializeData:function(){var a=this.model.toJSON();a.user=b.Objects.Models.user.toJSON();return a},postMessage:function(){var a=this.ui.message.val();""!=a&&(this.disableInput(),this.model.postMessage(a));b.Objects.Collections.messages.on("multiple:add",this.postMessageComplete,this)},messageKeyDown:function(a){var c=a.which;a=a.ctrlKey;(13==c&&(a||this.model.get("ignoreCtrl"))||10==c)&&this.postMessage()},enableInput:function(){this.ui.message.removeAttr("disabled")},disableInput:function(){this.ui.message.attr("disabled",
"disabled")},clearInput:function(){this.ui.message.val("").change()},postMessageComplete:function(){this.clearInput();this.enableInput();this.focused&&this.ui.focus();b.Objects.Collections.messages.off("multiple:add",this.postMessageComplete,this)},selectPredefinedAnswer:function(){var a=this.ui.message,c=this.ui.predefinedAnswer,b=c.get(0).selectedIndex;b&&(a.val(this.model.get("predefinedAnswers")[b-1].full).change(),a.focus(),c.get(0).selectedIndex=0)},checkUserTyping:function(){var a=b.Objects.Models.user,
c=""!=this.ui.message.val();c!=a.get("typing")&&a.set({typing:c})},setFocus:function(){this.focused=!0},dropFocus:function(){this.focused=!1}})})(Mibew,Backbone,Handlebars);
(function(a){a.Views.MessagesCollection=a.Views.CollectionBase.extend({itemView:a.Views.Message,className:"messages-collection",initialize:function(){this.collection.on("multiple:add",this.messagesAdded,this);a.Objects.Models.messageForm.on("before:post",this.messagePost,this)},skipNextSound:!0,messagePost:function(){this.skipNextSound=!0},messagesAdded:function(){if(!this.skipNextSound&&a.Objects.Models.Controls.sound.get("enabled")){var b=a.Objects.Models.page.get("webimRoot");b&&a.Objects.Models.sound.play(b+
"/sounds/new_message.wav")}this.skipNextSound=!1}})})(Mibew);
(function(a,b){a.Views.StatusMessage=a.Views.Status.extend({template:b.templates.status_message})})(Mibew,Handlebars);
(function(a){a.Views.StatusCollection=a.Views.CollectionBase.extend({itemView:a.Views.Status,className:"status-collection"})})(Mibew);
(function(a,b){a.Views.StatusTyping=a.Views.Status.extend({template:b.templates.status_typing})})(Mibew,Handlebars);
(function(a,j,k){var f=new j.Marionette.Application;f.addRegions({controlsRegion:"#controls-region",avatarRegion:"#avatar-region",messagesRegion:a.Regions.Messages,statusRegion:"#status-region",messageFormRegion:"#message-form-region",soundRegion:"#sound-region"});f.addInitializer(function(d){var g=a.Objects,c=a.Objects.Models,b=a.Objects.Models.Controls,h=a.Objects.Models.Status;g.server=new a.Server(k.extend({interactionType:MibewAPIChatInteraction},d.server));g.thread=new a.Thread(d.thread);c.user=
new a.Models.User(d.user);c.page=new a.Models.Page(d.page);var e=new a.Collections.Controls;c.user.get("isAgent")||(b.userName=new a.Models.UserNameControl({weight:220}),e.push(b.userName),b.sendMail=new a.Models.SendMailControl({weight:200,link:d.links.mailLink}),e.push(b.sendMail));c.user.get("isAgent")&&(b.redirect=new a.Models.RedirectControl({weight:200,link:d.links.redirectLink}),e.push(b.redirect),b.history=new a.Models.HistoryControl({weight:180,link:d.links.historyLink}),e.push(b.history));
b.sound=new a.Models.SoundControl({weight:160});e.push(b.sound);b.refresh=new a.Models.RefreshControl({weight:140});e.push(b.refresh);d.links.sslLink&&(b.secureMode=new a.Models.SecureModeControl({weight:120,link:d.links.sslLink}),e.push(b.secureMode));b.close=new a.Models.CloseControl({weight:100});e.push(b.close);g.Collections.controls=e;f.controlsRegion.show(new a.Views.ControlsCollection({collection:e}));h.message=new a.Models.StatusMessage({hideTimeout:5E3});h.typing=new a.Models.StatusTyping({hideTimeout:5E3});
g.Collections.status=new a.Collections.Status([h.message,h.typing]);f.statusRegion.show(new a.Views.StatusCollection({collection:g.Collections.status}));c.user.get("isAgent")||(c.avatar=new a.Models.Avatar,f.avatarRegion.show(new a.Views.Avatar({model:c.avatar})));g.Collections.messages=new a.Collections.Messages;c.messageForm=new a.Models.MessageForm(d.messageForm);f.messageFormRegion.show(new a.Views.MessageForm({model:c.messageForm}));f.messagesRegion.show(new a.Views.MessagesCollection({collection:g.Collections.messages}));
c.sound=new a.Models.Sound;f.soundRegion.show(new a.Views.Sound({model:c.sound}));g.server.runUpdater()});a.Application=f})(Mibew,Backbone,_);