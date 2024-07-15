//@ui5-bundle hrapprovalui/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"hrapprovalui/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","hrapprovalui/model/models"],function(e,i,t){"use strict";return e.extend("hrapprovalui.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});
},
	"hrapprovalui/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(n){"use strict";return n.extend("hrapprovalui.controller.App",{onInit:function(){}})});
},
	"hrapprovalui/controller/InitialRightScreen.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel"],function(e,t){"use strict";return e.extend("hrapprovalui.controller.InitialRightScreen",{onInit:function(){const e=new t;e.setData({conversationId:"",messageId:"",message_time:"",user_id:"",user_query:"",chatHistory:[],isBusy:false,enableTextArea:true});this.getView().setModel(e,"chatModel");this.getUserInfo();this.oOwnerComponent=this.getOwnerComponent();this.oRouter=this.oOwnerComponent.getRouter();this.oRouter.getRoute("home").attachPatternMatched(this.onRouteMatched,this)},getUserInfo:function(){const e=this.getBaseURL()+"/user-api/currentUser";var s=new t;var o={firstname:"Dummy",lastname:"User",email:"dummy.user@com",name:"dummy.user@com",displayName:"Dummy User (dummy.user@com)"};s.loadData(e);s.dataLoaded().then(()=>{console.log(s.getData());if(!s.getData().email){s.setData(o)}this.getView().setModel(s,"userInfo")}).catch(()=>{s.setData(o);this.getView().setModel(s,"userInfo")})},getBaseURL:function(){var e=this.getOwnerComponent().getManifestEntry("/sap.app/id");var t=e.replaceAll(".","/");var s=jQuery.sap.getModulePath(t);return s},onRouteMatched(e){this.clearChatHistory()},clearChatHistory:function(){const e=this.getView().getModel("chatModel");const t="/chatHistory";const s=[];e.setProperty(t,s)},onSendMessage:function(e){this.setBusy(true);this.setEnableTextArea(false);const t=e.getParameter("value");const s=e.getSource();const o=this.getOwnerComponent().getRouter();this.setUserQuestionInToChatMessage(t);const n=this.getView().getModel("chatModel");const r=n.getProperty("/conversationId");const a=JSON.stringify({conversationId:r,messageId:n.getProperty("/messageId"),message_time:n.getProperty("/message_time"),user_id:n.getProperty("/user_id"),user_query:n.getProperty("/user_query")});this.sendMessage(a).then(e=>{this.setBackendResponseInToChatMessage(e);setTimeout(()=>{o.navTo("conversation",{conversationID:r})},1e3)}).catch(e=>{console.log(e)}).finally(()=>{this.setBusy(false);this.setEnableTextArea(true)})},sendMessage:function(e){return new Promise((t,s)=>{$.ajax({url:this.getBaseURL()+"/odata/v4/chat/getChatRagResponse",type:"POST",contentType:"application/json",async:true,data:e,success:function(e,o,n){console.log(n);if(n.status===200||n.status===201){t(n.responseJSON)}else{s(n.responseJSON)}},error:function(e,t){if(e){if(e.responseJSON){const t=e.responseJSON.message||e.responseJSON.status_msg;s(t)}else{s(e.responseText)}}else{s(t)}}})})},setBackendResponseInToChatMessage(e){const t=this.getView().getModel("chatModel");const s=t.getProperty("/conversationId");const o={conversationId:s,messageId:self.crypto.randomUUID(),message_time:new Date(e.messageTime),content:e.content,user_id:"",user_role:e.role,icon_path:"sap-icon://da-2",initials:""};const n="/chatHistory";const r=t.getProperty(n);r.push(o);t.setProperty(n,r)},setBusy:function(e){const t="/isBusy";this.getView().getModel("chatModel").setProperty(t,e)},setEnableTextArea:function(e){const t="/enableTextArea";this.getView().getModel("chatModel").setProperty(t,e)},setUserQuestionInToChatMessage(e){const t=this.getView().getModel("chatModel");const s=this.getView().getModel("userInfo");t.setProperty("/conversationId",self.crypto.randomUUID());t.setProperty("/messageId",self.crypto.randomUUID());t.setProperty("/message_time",(new Date).toISOString());t.setProperty("/user_query",e);t.setProperty("/user_id",s.getProperty("/email"));const o={conversationId:t.getProperty("/conversationId"),messageId:t.getProperty("/messageId"),message_time:new Date(t.getProperty("/message_time")),content:e,user_id:t.getProperty("/user_id"),user_role:"You",icon_path:"",initials:s.getProperty("/firstname").charAt(0)+s.getProperty("/lastname").charAt(0)};const n="/chatHistory";const r=t.getProperty(n);r.push(o);t.setProperty(n,r)},onListUpdateFinished:function(e){const t=e.getSource().getItems();if(t.length===0){return}t[t.length-1].focus()}})});
},
	"hrapprovalui/controller/LeftScreen.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/upload/UploadSetwithTable","sap/m/upload/UploadSetwithTableItem","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/m/MessageBox"],function(e,t,n,o,s,i,a,l){"use strict";return e.extend("hrapprovalui.controller.LeftScreen",{onInit:function(){this.getUserInfo();this.oOwnerComponent=this.getOwnerComponent();this.oRouter=this.oOwnerComponent.getRouter();this.oRouter.getRoute("home").attachPatternMatched(this.onRouteMatched,this);this.oRouter.getRoute("conversation").attachPatternMatched(this.onRouteMatched,this)},onRouteMatched(e){this.getView().byId("leftScreenChatList").getBinding("items").refresh()},onConversationPress:function(e){const t=e.getParameter("listItem");const n=t.getBindingContext().getProperty("cID");const o=this.getOwnerComponent().getRouter();o.navTo("conversation",{conversationID:n})},onHandleConversationDelete:function(e){const t=e.getParameter("listItem");const n=t.getBindingContext().getProperty("cID");const o=t.getBindingContext().getProperty("title").toString();const s=this.getOwnerComponent().getRouter();const a=s.getHashChanger().getHash();const r=s.getRouteInfoByHash(a);l.warning(`This will delete ${o}`,{icon:l.Icon.WARNING,actions:["Remove",l.Action.CANCEL],emphasizedAction:"Remove",styleClass:"sapMUSTRemovePopoverContainer",initialFocus:l.Action.CANCEL,onClose:e=>{if(e!=="Remove"){return}this.requestConversationDelete(n).then(e=>{i.show(`Conversation successfully deleted.`);if(r.name!=="home"){this.oRouter.navTo("home")}else{this.getView().byId("leftScreenChatList").getBinding("items").refresh()}}).catch(e=>{console.log(e);i.show(`Conversation deletion failed.`)})}})},requestConversationDelete:function(e){const t={url:this.getBaseURL()+`/odata/v4/chat/Conversation(${e})`,method:"DELETE",headers:{"Content-type":"application/json"}};return new Promise((e,n)=>{$.ajax(t).done((t,n,o)=>{e(t)}).fail(e=>{n(e)})})},onCreateNewChat:function(e){const t=this.getOwnerComponent().getRouter();t.navTo("home")},onUploadFileBtnSelect:function(e){this.fileUploadFragment??=this.loadFragment({name:"hrapprovalui.view.FileUploading"});this.fileUploadFragment.then(e=>e.open())},onCloseUploadFileFragment:function(){this.byId("fileUploadFragment").close()},onManageFileBtnSelect:function(){this.fileManagementFragment??=this.loadFragment({name:"hrapprovalui.view.FileManagement"});this.fileManagementFragment.then(e=>e.open())},onCloseManageFileFragment:function(){this.byId("fileManagementFragment").close()},onAfterItemAdded:function(e){console.log(e);const t=e.getParameter("item");this.createEntity(t).then(e=>{this.uploadContent(t,e)}).catch(e=>{console.log(e)})},onUploadCompleted:function(e){var t=this.byId("uploadSet");t.removeAllIncompleteItems();t.getBinding("items").refresh()},createEntity:function(e){const t={ID:self.crypto.randomUUID(),mediaType:e.getMediaType(),fileName:e.getFileName(),size:e.getFileObject().size.toString()};const n={url:this.getBaseURL()+"/odata/v4/embedding-storage/Files",method:"POST",headers:{"Content-type":"application/json"},data:JSON.stringify(t)};return new Promise((e,t)=>{$.ajax(n).done((t,n,o)=>{e(t.ID)}).fail(e=>{t(e)})})},uploadContent:function(e,t){var n=this.getBaseURL()+`/odata/v4/embedding-storage/Files(${t})/content`;e.setUploadUrl(n);var o=this.byId("uploadSet");o.setHttpRequestMethod("PUT");o.uploadItem(e)},onSelectionChange:function(e){const t=e.getSource();const n=t.getSelectedItems();const o=this.byId("downloadSelectedButton");const s=this.byId("deleteSelectedButton");if(n.length>0){o.setEnabled(true);s.setEnabled(true)}else{o.setEnabled(false);s.setEnabled(false)}},getIconSrc:function(e,n){return t.getIconForFileType(e,n)},getFileSizeWithUnits:function(e){return t.getFileSizeWithUnits(e)},onFileNameSearch:function(e){const t=[];const n=e.getSource().getValue();if(n&&n.length>0){const e=new o("fileName",s.Contains,n);t.push(e)}const i=this.byId("uploadSetWithTable");const a=i.getBinding("items");a.filter(t,"Application")},onDownloadFiles:function(e){const t=this.byId("uploadSetWithTable");const n=t.getSelectedItem();const o=n.mAggregations;const s=o.cells[1].getProperty("text");const i=n.getProperty("fileName");this.requestFileDownload(s).then(e=>{var t=window.URL.createObjectURL(e);var n=document.createElement("a");n.href=t;n.setAttribute("download",i);document.body.appendChild(n);n.click();document.body.removeChild(n)}).catch(e=>{console.log(e)})},requestFileDownload:function(e){const t={url:this.getBaseURL()+`/odata/v4/embedding-storage/Files(${e})/content`,method:"GET",xhrFields:{responseType:"blob"}};return new Promise((e,n)=>{$.ajax(t).done((t,n,o)=>{e(t)}).fail(e=>{n(e)})})},onGenerateVectorBtnClick:function(e){let t=e.getSource();let o=null;while(t&&!(t instanceof n)){t=t.getParent()}if(t instanceof n){o=t}const s=o.mAggregations;const a=s.cells[1].getProperty("text");this.byId("fileManagementFragment").setBusy(true);this.requestEmbeddingGeneration(a).then(e=>{this.byId("fileManagementFragment").setBusy(false);i.show("Embeddings generation completed successfully.")}).catch(e=>{this.byId("fileManagementFragment").setBusy(false);i.show("Embeddings generation failed, please try again.")})},requestEmbeddingGeneration:function(e){const t=JSON.stringify({uuid:e.toString()});return new Promise((e,n)=>{$.ajax({url:this.getBaseURL()+"/odata/v4/embedding-storage/storeEmbeddings",type:"POST",contentType:"application/json",async:true,data:t,success:function(t,o,s){console.log("Success: "+s);if(s.status===200||s.status===201){e(s.responseJSON)}else{n(s.responseJSON)}},error:function(e,t){console.log("Fail: "+e);if(e){if(e.responseJSON){const t=e.responseJSON.message||e.responseJSON.status_msg;n(t)}else{n(e.responseText)}}else{n(t)}}})})},onBeforeOpenContextMenu:function(e){this.byId("uploadSetWithTable").getBinding("items").refresh()},beforeFileManagementDialogOpen:function(e){this.byId("uploadSetWithTable").getBinding("items").refresh()},onDeleteFiles:function(e){this.byId("fileManagementFragment").setBusy(true);const t=this.byId("uploadSetWithTable");const n=t.getSelectedItem();const o=n.mAggregations;const s=o.cells[1].getProperty("text");const a=n.getProperty("fileName");this.requestFileDelete(s).then(e=>{this.byId("fileManagementFragment").setBusy(false);this.byId("uploadSetWithTable").getBinding("items").refresh();this.byId("uploadSet").getBinding("items").refresh();const t=this.byId("downloadSelectedButton");const n=this.byId("deleteSelectedButton");t.setEnabled(false);n.setEnabled(false);i.show(`File ${a} with ID ${s} successfully deleted`)}).catch(e=>{console.log(e.message);this.byId("fileManagementFragment").setBusy(false);i.show(`File ${a} with ID ${s} deletion failed`)})},requestFileDelete:function(e){const t={url:this.getBaseURL()+`/odata/v4/embedding-storage/Files(${e})`,method:"DELETE"};return new Promise((e,n)=>{$.ajax(t).done((t,n,o)=>{e(t)}).fail(e=>{n(e)})})},onDeleteEmbedding:function(e){this.byId("fileManagementFragment").setBusy(true);this.requestEmbeddingDelete().then(e=>{this.byId("fileManagementFragment").setBusy(false);i.show(`All embeddings successfully deleted.`)}).catch(e=>{console.log(e.message);this.byId("fileManagementFragment").setBusy(false);i.show(`Embeddings deletion failed.`)})},requestEmbeddingDelete:function(){const e={url:this.getBaseURL()+"/odata/v4/embedding-storage/deleteEmbeddings()",method:"GET"};return new Promise((t,n)=>{$.ajax(e).done((e,n,o)=>{t(e)}).fail(e=>{n(e)})})},getUserInfo:function(){const e=this.getBaseURL()+"/user-api/currentUser";var t=new a;var n={firstname:"Dummy",lastname:"User",email:"dummy.user@com",name:"dummy.user@com",displayName:"Dummy User (dummy.user@com)"};t.loadData(e);t.dataLoaded().then(()=>{console.log(t.getData());if(!t.getData().email){t.setData(n)}this.getView().setModel(t,"userInfo")}).catch(()=>{t.setData(n);this.getView().setModel(t,"userInfo")})},getBaseURL:function(){var e=this.getOwnerComponent().getManifestEntry("/sap.app/id");var t=e.replaceAll(".","/");var n=jQuery.sap.getModulePath(t);return n}})});
},
	"hrapprovalui/controller/OfficalRightScreen.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel"],function(e,t){"use strict";return e.extend("hrapprovalui.controller.OfficalRightScreen",{onInit:function(){const e=new t;e.setData({conversationId:"",messageId:"",message_time:"",user_id:"",user_query:"",chatHistory:[],isBusy:false,enableTextArea:true});this.getView().setModel(e,"chatModel");this.getUserInfo();this.oOwnerComponent=this.getOwnerComponent();this.oRouter=this.oOwnerComponent.getRouter();this.oRouter.getRoute("conversation").attachPatternMatched(this.onRouteMatched,this)},getUserInfo:function(){const e=this.getBaseURL()+"/user-api/currentUser";var s=new t;var o={firstname:"Dummy",lastname:"User",email:"dummy.user@com",name:"dummy.user@com",displayName:"Dummy User (dummy.user@com)"};s.loadData(e);s.dataLoaded().then(()=>{console.log(s.getData());if(!s.getData().email){s.setData(o)}this.getView().setModel(s,"userInfo")}).catch(()=>{s.setData(o);this.getView().setModel(s,"userInfo")})},getBaseURL:function(){var e=this.getOwnerComponent().getManifestEntry("/sap.app/id");var t=e.replaceAll(".","/");var s=jQuery.sap.getModulePath(t);return s},onRouteMatched(e){this.clearChatHistory();const{conversationID:t}=e.getParameter("arguments");this.getView().bindElement({path:`/Conversation(${t})`});this.loadConversationHistory(t)},clearChatHistory:function(){const e=this.getView().getModel("chatModel");const t="/chatHistory";const s=[];e.setProperty(t,s)},loadConversationHistory(e){const s=this.getBaseURL()+`/odata/v4/chat/Conversation(${e})/to_messages`;var o=new t;o.loadData(s);o.dataLoaded().then(()=>{this.setConversationHistory(o.getData())})},setConversationHistory(e){const t=this.getView().getModel("userInfo");const s=this.getView().getModel("chatModel");const o="/chatHistory";const a=s.getProperty(o);for(const s of e.value){const e={conversationId:s.cID_cID,messageId:s.mID,message_time:new Date(s.creation_time),content:s.content,user_id:"",user_role:s.role==="assistant"?"assistant ":"You",icon_path:s.role==="assistant"?"sap-icon://da-2":"",initials:s.role==="assistant"?"":t.getProperty("/firstname").charAt(0)+t.getProperty("/lastname").charAt(0)};a.push(e)}s.setProperty(o,a)},onSendMessage:function(e){this.setBusy(true);this.setEnableTextArea(false);const t=e.getParameter("value");const s=e.getSource();this.setUserQuestionInToChatMessage(t);const o=this.getView().getModel("chatModel");const a=o.getProperty("/conversationId");const n=JSON.stringify({conversationId:a,messageId:o.getProperty("/messageId"),message_time:o.getProperty("/message_time"),user_id:o.getProperty("/user_id"),user_query:o.getProperty("/user_query")});this.sendMessage(n).then(e=>{this.setBackendResponseInToChatMessage(e)}).catch(e=>{console.log(e)}).finally(()=>{this.setBusy(false);this.setEnableTextArea(true)})},setBusy:function(e){const t="/isBusy";this.getView().getModel("chatModel").setProperty(t,e)},setEnableTextArea:function(e){const t="/enableTextArea";this.getView().getModel("chatModel").setProperty(t,e)},setUserQuestionInToChatMessage(e){const t=this.getView().getModel("chatModel");const s="/chatHistory";const o=t.getProperty(s);const a=o[0].conversationId;const n=this.getView().getModel("userInfo");t.setProperty("/conversationId",a);t.setProperty("/messageId",self.crypto.randomUUID());t.setProperty("/message_time",(new Date).toISOString());t.setProperty("/user_query",e);t.setProperty("/user_id",n.getProperty("/email"));const r={conversationId:t.getProperty("/conversationId"),messageId:t.getProperty("/messageId"),message_time:new Date(t.getProperty("/message_time")),content:e,user_id:t.getProperty("/user_id"),user_role:"You",icon_path:"",initials:n.getProperty("/firstname").charAt(0)+n.getProperty("/lastname").charAt(0)};o.push(r);t.setProperty(s,o)},sendMessage:function(e){return new Promise((t,s)=>{$.ajax({url:this.getBaseURL()+"/odata/v4/chat/getChatRagResponse",type:"POST",contentType:"application/json",async:true,data:e,success:function(e,o,a){console.log(a);if(a.status===200||a.status===201){t(a.responseJSON)}else{s(a.responseJSON)}},error:function(e,t){if(e){if(e.responseJSON){const t=e.responseJSON.message||e.responseJSON.status_msg;s(t)}else{s(e.responseText)}}else{s(t)}}})})},setBackendResponseInToChatMessage(e){const t=this.getView().getModel("chatModel");const s=t.getProperty("/conversationId");const o={conversationId:s,messageId:self.crypto.randomUUID(),message_time:new Date(e.messageTime),content:e.content,user_id:"",user_role:e.role,icon_path:"sap-icon://da-2",initials:""};const a="/chatHistory";const n=t.getProperty(a);n.push(o);t.setProperty(a,n)}})});
},
	"hrapprovalui/i18n/i18n.properties":'# This is the resource bundle for hrapprovalui\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Chat Demo of CAP LLM Plugin\n\n#YDES: Application description\nappDescription=An SAP Fiori application.\n#XTIT: Main view title\ntitle=Chat Demo of CAP LLM Plugin\n\nflpTitle=HR Approval Demo\n\nflpSubtitle=Powered by CAP LLM Plugin and SuccessFactor\n',
	"hrapprovalui/manifest.json":'{"_version":"1.59.0","sap.app":{"id":"hrapprovalui","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.12.4","toolsId":"2f10dee8-63c3-46f0-a270-d704153ff59a"},"dataSources":{"mainService":{"uri":"odata/v4/chat/","type":"OData","settings":{"annotations":[],"odataVersion":"4.0"}},"fileService":{"uri":"odata/v4/embedding-storage/","type":"OData","settings":{"annotations":[],"odataVersion":"4.0"}}},"crossNavigation":{"inbounds":{"Chat-Display":{"semanticObject":"Chat","action":"Display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.120.9","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{},"sap.ui.unified":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"hrapprovalui.i18n.i18n"}},"":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"files":{"dataSource":"fileService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}}},"resources":{"css":[{"uri":"css/style.css"}]},"rootView":{"viewName":"hrapprovalui.view.App","type":"XML","async":true,"id":"App"},"routing":{"config":{"routerClass":"sap.f.routing.Router","viewType":"XML","async":true,"viewPath":"hrapprovalui.view","controlId":"flexibleColumnLayout","transition":"slide"},"routes":[{"pattern":"","name":"home","target":["leftScreen","initialRightScreen"],"layout":"TwoColumnsMidExpanded"},{"pattern":"conversation/{conversationID}","name":"conversation","target":["leftScreen","officalRightScreen"],"layout":"TwoColumnsMidExpanded"}],"targets":{"leftScreen":{"viewId":"lefeScreenPage","viewName":"LeftScreen","controlAggregation":"beginColumnPages"},"initialRightScreen":{"viewId":"initialRightScreen","viewName":"InitialRightScreen","controlAggregation":"midColumnPages"},"officalRightScreen":{"viewId":"officalRightScreen","viewName":"OfficalRightScreen","controlAggregation":"midColumnPages"}}}},"sap.cloud":{"public":true,"service":"hr.app"}}',
	"hrapprovalui/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"hrapprovalui/view/App.view.xml":'<mvc:View \n    controllerName="hrapprovalui.controller.App"\n    xmlns:f="sap.f" \n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"\n    displayBlock="true"><App id="app"><f:FlexibleColumnLayout id="flexibleColumnLayout" backgroundDesign="Solid"></f:FlexibleColumnLayout></App></mvc:View>\n',
	"hrapprovalui/view/FileManagement.fragment.xml":'<core:FragmentDefinition \n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:m="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns="sap.m.upload"><m:Dialog \n        id="fileManagementFragment"\n        title="Manage Files"\n        resizable="true"\n        draggable="true"\n        beforeOpen=".beforeFileManagementDialogOpen"><UploadSetwithTable\n            id="uploadSetWithTable"\n            class="sapUiSmallMargin"\n            sticky="ColumnHeaders,HeaderToolbar"\n            mode="SingleSelectLeft"\n            growing="true"\n            growingThreshold="5"\n            growingScrollToLoad="true"\n            width="auto"\n            fixedLayout="false"\n            uploadEnabled="false"\n            uploadButtonInvisible="true"\n            items="{ \n                path:\'files>/Files\',\n                parameters: {\n                    $orderby: \'createdAt desc\'\n\t\t\t    },\n\t\t\t    templateShareable: false\n            }"\n            selectionChange=".onSelectionChange"\n            beforeOpenContextMenu=".onBeforeOpenContextMenu"><headerToolbar><m:OverflowToolbar \n                    id="overflowToolBar"><m:Title\n                        id="overflowToolBarTitle"\n                        text="Files"\n                        level="H2"/><m:SearchField\n                        id="overflowToolBarSearchField"\n                        width="20%"\n                        liveChange=".onFileNameSearch"><m:layoutData><m:OverflowToolbarLayoutData\n                                id="overflowToolBarLayOut"\n                                priority="NeverOverflow"\n                            /></m:layoutData></m:SearchField><m:ToolbarSpacer id="overflowToolBarSpacer"/><m:Button\n                        id="downloadSelectedButton"\n                        text="Download"\n                        enabled="false"\n                        press=".onDownloadFiles"/><m:Button\n                        id="deleteSelectedButton"\n                        text="Delete"\n                        enabled="false"\n                        press=".onDeleteFiles"/><m:Button\n                        id="deleteEmbeddingSelectedButton"\n                        text="Delete Embeddings"\n                        enabled="true"\n                        press=".onDeleteEmbedding"/></m:OverflowToolbar></headerToolbar><columns><Column id="fileName" importance="High"><header><m:Label id="labelForFileName" text="File Name" /></header></Column><Column id="id"><header><m:Label id="labelForID" text="ID" /></header></Column><Column id="status"><header><m:Label id="labelForStatus" text="Status" /></header></Column><Column id="fileSize"><header><m:Label id="labelForFileSize" text="File Size" /></header></Column><Column id="actionButton" importance="High" ><header><m:Label id="labelForActionButton" text="Generate Embeddings" /></header></Column></columns><items><UploadSetwithTableItem\n                    id="uploadSetwithTableItems"\n                    fileName="{files>fileName}"\n                    mediaType="{files>mediaType}"\n                    fileSize="{files>size}"><cells><m:HBox id="hboxForFileName"><core:Icon\n                                id="FileNameIcon"\n                                src="{parts: [\'files>mediaType\', \'files>fileName\'], formatter: \'.getIconSrc\' }"\n                                color="white"\n                                visible="true"\n                                class="sapMUSTItemImage sapMUSTItemIcon"\n                            /><m:VBox id="vboxForFileName" class="sapUiTinyMargin sapUiSmallMarginBegin"><m:Text id="fileNameText"  text="{files>fileName}" class="sapUiTinyMarginTop" /></m:VBox></m:HBox><m:Text id="fileIDText" text="{files>ID}" /><m:Text id="fileStatusText"  text="Completed" /><m:Text id="fileSizeText"\n                            text="{path: \'files>size\', formatter: \'.getFileSizeWithUnits\'}"\n                        /><m:Button\n                            id="trainingButton"\n                            class="sapUiTinyMarginBegin"\n                            type="Transparent"\n                            icon="sap-icon://begin"\n                            press=".onGenerateVectorBtnClick"\n                        /></cells></UploadSetwithTableItem></items></UploadSetwithTable><m:beginButton><m:Button\n                id="fileManagementFragCloseBtn"\n                text="Close"\n                press=".onCloseManageFileFragment"/></m:beginButton></m:Dialog></core:FragmentDefinition>',
	"hrapprovalui/view/FileUploading.fragment.xml":'<core:FragmentDefinition \n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:m="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns="sap.m.upload"\n><m:Dialog\n    id="fileUploadFragment"\n    title="Upload Files"><UploadSet \n        id="uploadSet"\n        instantUpload="false"\n        uploadEnabled="true"\n        showIcons="true"\n        terminationEnabled="true"\n        maxFileNameLength="30"\n        maxFileSize="200"\n        fileTypes="pdf"\n        mediaTypes="application/pdf"\n        afterItemAdded=".onAfterItemAdded"\n        uploadCompleted=".onUploadCompleted"\n        mode="None"\t\n        items="{ \n            path:\'files>/Files\',\n            parameters: {\n                $orderby: \'createdAt desc\'\n\t\t\t},\n\t\t\ttemplateShareable: false\n         }"><items><UploadSetItem \n                id="uploadSetItems"\n                fileName="{files>fileName}"\n                mediaType="{files>mediaType}"\n                enabledEdit="false"\n                visibleEdit="false"\n                enabledRemove="false"\n                visibleRemove="false"\n                ><m:ObjectAttribute\n                    id="uploadSetItemAttribute1" \n                    title="Uploaded By"\n\t\t\t\t\ttext="{files>createdBy}"\n\t\t\t\t\tactive="false"/><m:ObjectAttribute\n                    id="uploadSetItemAttribute2" \n\t\t\t\t\ttitle="Uploaded on"\n\t\t\t\t\ttext="{files>createdAt}"\n\t\t\t\t\tactive="false"/><m:ObjectAttribute\n                    id="uploadSetItemAttribute3" \n\t\t\t\t\ttitle="File Size"\n\t\t\t\t\ttext="{files>size}"\n\t\t\t\t\tactive="false"/></UploadSetItem></items></UploadSet><m:beginButton><m:Button\n            id="closeBtn"\n            text="Close"\n            press=".onCloseUploadFileFragment"/></m:beginButton></m:Dialog></core:FragmentDefinition>',
	"hrapprovalui/view/InitialRightScreen.view.xml":'<mvc:View \n    controllerName="hrapprovalui.controller.InitialRightScreen"\n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:f="sap.f"\n\tdisplayBlock="true"\n\theight="100%"\n\tbusyIndicatorDelay="0"><Page \n        id="initialRightScreen"\n        showFooter="true"\n        showHeader="false"\n        floatingFooter="true"\n        class="sapUiResponsivePadding--content sapUiResponsivePadding--footer sapUiResponsivePadding--floatingFooter"><VBox id="initialRightScreenVBox"><List \n                    id="initialRightScreenVBoxList"\n                    showSeparators="Inner"\n                    noDataText="How can I help you today ?"\n                    updateFinished=".onListUpdateFinished"\n                    items="{chatModel>/chatHistory/}"\n                    busy="{chatModel>/isBusy}"><FeedListItem \n                        id="initialRightScreenListItem"\n                        info="{chatModel>user_role}"\n                        text="{chatModel>content}"\n                        timestamp="{chatModel>message_time}"\n                        icon="{chatModel>icon_path}"\n                        iconInitials="{chatModel>initials}"\n                        showIcon="true"></FeedListItem></List></VBox><footer><OverflowToolbar\n                id="initialRightScreenOverflowToolbar"\n                width="100%"\n                height="auto"\n                ><FeedInput\n                    id="initialFeedInput"\n                    showIcon="false"\n                    placeholder="Enter your message...."\n                    growing="true"\n                    post=".onSendMessage"\n                    enabled="{chatModel>/enableTextArea}"\n                ></FeedInput></OverflowToolbar></footer></Page></mvc:View>',
	"hrapprovalui/view/LeftScreen.view.xml":'<mvc:View xmlns:tnt="sap.tnt"\n    controllerName="hrapprovalui.controller.LeftScreen"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.f"\n    xmlns:m="sap.m"\n    height="100%"\n    displayBlock="true"\n><m:Page\n        id="lefeScreenPage"\n        showHeader="false"\n        showFooter="false"><m:content><m:OverflowToolbar \n                id="leftScreenOverflowToolBar"\n                height="3rem"><m:Title\n                    id="leftScreenToolBarTitle"\n                    text="Chats"\n                /><m:ToolbarSpacer id="leftScreenToolBarSpacer" /><m:Button\n                    id="leftScreenToolBarButton"\n                    icon="sap-icon://add"\n                    text="New chat"\n                    press=".onCreateNewChat"\n                /></m:OverflowToolbar><m:ScrollContainer\n                id="leftScreenScrollContainer"\n                vertical="true"\n                height="80%"\n                focusable="true"><m:List\n                    id="leftScreenChatList"\n                    growing="true"\n                    growingThreshold="15"\n                    growingScrollToLoad="true"\n                    noDataText="No chat history available"\n                    enableBusyIndicator="true"\n                    items="{\n                            path:\'/Conversation\',\n                            sorter:{\n                                path:\'last_update_time\',\n                                descending: true\n                            }\n                        }"\n                    itemPress=".onConversationPress"\n                    mode="Delete"\n                    delete=".onHandleConversationDelete"\n                    ><m:StandardListItem\n                        id="_IDGenStandardListItem1"\n                        type="Navigation"\n                        title="{= ${title}.length > 0 ? ${title} : \'Local Testing\'}"\n                        description="{userID} | {creation_time}"\n                    /></m:List></m:ScrollContainer><tnt:NavigationList \n                id="leftScreenNavigationList"><tnt:NavigationListItem\n                    id="leftScreenFileUploadBtn" \n                    icon="sap-icon://upload"\n                    text="Upload Files"\n                    select=".onUploadFileBtnSelect"/><tnt:NavigationListItem\n                    id="leftScreenManageFilesBtn" \n                    icon="sap-icon://collections-management"\n                    text="Manage Files" \n                    select=".onManageFileBtnSelect"/></tnt:NavigationList></m:content></m:Page></mvc:View>\n',
	"hrapprovalui/view/OfficalRightScreen.view.xml":'<mvc:View\n    controllerName="hrapprovalui.controller.OfficalRightScreen"\n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:f="sap.f"\n\tdisplayBlock="true"\n\theight="100%"\n\tbusyIndicatorDelay="0"><Page \n            id="initialRightScreen"\n            showFooter="true"\n            showHeader="false"\n            floatingFooter="true"\n            class="sapUiResponsivePadding--content sapUiResponsivePadding--footer sapUiResponsivePadding--floatingFooter"><VBox \n                id="officialRightScreenVBox"><List \n                    id="officialRightScreenVBoxList"\n                    showNoData="false"\n                    showSeparators="Inner"\n                    items="{\n                        path:\'chatModel>/chatHistory/\',\n                        sorter:{\n                            path:\'message_time\',\n                            descending: false\n                        }\n                    }"\n                    busy="{chatModel>/isBusy}"><FeedListItem \n                        id="_IDGenFeedListItem1"\n                        class="feedListItem"\n                        convertLinksToAnchorTags="All"\n                        info="{chatModel>user_role}"\n                        text="{chatModel>content}"\n                        timestamp="{chatModel>message_time}"\n                        icon="{chatModel>icon_path}"\n                        iconInitials="{chatModel>initials}"\n                        showIcon="true"></FeedListItem></List></VBox><footer><OverflowToolbar\n                id="officialRightScreenOverflowToolbar"\n                width="100%"\n                height="auto"\n                ><FeedInput\n                    id="officialFeedInput"\n                    showIcon="false"\n                    placeholder="Enter your message...."\n                    growing="true"\n                    post=".onSendMessage"\n                    enabled="{chatModel>/enableTextArea}"\n                ></FeedInput></OverflowToolbar></footer></Page></mvc:View>'
}});
