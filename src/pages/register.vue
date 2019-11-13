<template>
    <div class="login animated">
        <h2>会员管理系统</h2>
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom">
            <FormItem prop="username">
                <Input type="text" v-model="formCustom.username" clearable min="1" placeholder="请输入您的手机号码">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="code">
                <Input type="text" v-model="formCustom.code" clearable  placeholder="请输入您购买的充值卡号">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="password">
                <Input type="text" v-model="formCustom.password" clearable  placeholder="请输入一个登录密码">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="codeNum" v-if="1" class="code-item">
                <Input type="text" style="width:60%;" v-model="formCustom.codeNum" clearable  placeholder="请输入验证码" >
                    <Icon type="ios-barcode" slot="prepend"></Icon> 
                </Input>
                <div @click="randomNum" :style="{ color: `#${randomCode}`}" class="code-cont">{{ randomCode }}</div>
            </FormItem>
            <FormItem class="submit">
                <Button type="primary" long @click="handleSubmit('formCustom')">激活账号</Button>
                <Button class="ivu-btn-register" long to="/">返回登录</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        data () {
            const username = (rule, value, callback) => {
                var reg=11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
                if (value === '') {
                    callback(new Error('请输入您自己的手机号码作为登录账号'));
                }
                else if(!reg.test(value)){
                    callback(new Error('手机号码格式不正确，请重新输入'));
                }else {
                    callback();
                }
            };
            const code = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入您购买的充值卡号'));
                }else {
                    callback();
                }
            };
            const password = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请设置一个登录密码'));
                }else {
                    callback();
                }
            };
            const codeNum = (rule, value, callback) => {            
                if (value !== this.randomCode) {
                    callback(new Error('验证码不对!'));
                    this.randomNum();
                }else {
                    callback();
                }
            };
            
            return {
                randomCode: null,
                formCustom: {
                    username: '',
                    code: '',
                    password: '',
                    codeNum: ''
                },
                ruleCustom: {
                    username: [
                        { validator: username, trigger: 'blur' }
                    ],
                    code: [
                        { validator: code, trigger: 'blur' }
                    ],
                    password: [
                        { validator: password, trigger: 'blur' }
                    ],
                    codeNum: [
                        { validator: codeNum, trigger: 'blur' }
                    ]
                }
            }
        },
        mounted() {
            this.randomNum();
            this.doc();
        },
        methods: {
            randomNum(){
                this.randomCode =  Math.random().toString(16).slice(-6);
            },
            doc(){
                this.$Modal.info({
                    title: '温馨提醒',
                    okText: '我知道了',
                    content: '<p>第一次使用？先看看注册教程吧。</p><p style="margin-top:8px;">第一行填写您的手机号，作为网站登录账号。</p><p>第二行粘贴您购买到的充值卡号。</p><p>第三行填写一个账号登录密码，然后点击注册。</p><p style="margin-top:8px;color:red;">请记好您的账号注册账号以及登录密码，<br />避免遗失不能登录。</p>'
                });
            },
            login(){
                let vm = this;
                vm.axios.post('/login', {
                    mobile : vm.formCustom.username,
                    password : vm.formCustom.password,
                })
                .then(function (res) {
                    let data = res.data;
                    if(res.status==200 && res.data.code == 0){
                        var info = {'token' : data.data.token};
                        var user = {'mobile': vm.formCustom.username,'password': vm.formCustom.password};
                        sessionStorage.setItem('userInfo', JSON.stringify(info));
                        localStorage.setItem('user', JSON.stringify(user));
                        vm.$router.push({ path: '/index' })
                    }else{
                        vm.$Message.error(data.message);
                    }
                    
                })
                .catch(function (error) {
                });
            },
            trim(str){
        　　     return str.replace(/(^\s*)|(\s*$)/g, "");
        　　 },
            register(){
                let vm =this;
                vm.axios.post('/activate', {
                    mobile : vm.formCustom.username,
                    code : vm.trim(vm.formCustom.code),
                    password: vm.formCustom.password
                })
                .then(function (res) {
                    if(res.status==200 && res.data.code == 0){
                        vm.$Modal.confirm({
                            title: '温馨提醒',
                            okText: '登录系统',
                            content: '<p>账号已经激活成功，请记住您的账号。</p><p>账号初始登录密码为：<strong style="color:red">' + vm.formCustom.password  +'</strong></p><p>下次直接使用账号登录系统即可，无需再次激活。</p>',
                            onOk: () => {
                                vm.login();
                            }
                        });
                    }else{
                        if(res.data.code==-1 && res.data.message =='数据错误'){
                            vm.$Message.error('充值卡号不正确请检查！');
                        }
                        else{
                            vm.$Message.error(res.data.message);
                        }
                    }
                    
                })
                .catch(function (error) {
                });
            },
            handleSubmit (name) {
                let vm = this;
                vm.$refs[name].validate((valid) => {
                    if (valid) {
                        vm.register();
                    } else {
                        vm.$Message.error('请将表单填写完整后再提交！');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>
<style lang="scss">
body{
    background-color: #F2F2F2!important;
}
.login{
    width: 400px;
    height: auto;
    padding: 30px 30px 1px;
    margin: 150px auto!important;
    border-radius: 4px;
    background-color: #fff;
    z-index: 9;
    -webkit-box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.05);
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.05);
    h2{
        text-align: center;
        margin: 10px 0 20px;
    }
    .ivu-form-item{
        margin-bottom: 22px;
    }
    .forget{
        padding: 0;
        float: right;
        line-height: 32px!important;
        font-size: 12px!important;
        height: 32px!important;
        &:hover{
            background: none;
        }
    }
    .doc {
        padding: 0;
        float: right;
        line-height: 30px;
        font-size: 12px!important;
        height: 32px!important;
        &:hover{
            background: none;
        }
    }
    .submit{
        .ivu-btn{
            margin-bottom: 10px;
        }
        .ivu-btn-register{
            line-height: 28px;
        }
    }
    .ivu-input-icon{
        top: 5px;
    }
    .ivu-input-group-prepend{
        width: 42px;
        background-color: #fff;
    }
    .ivu-checkbox-wrapper,.forget{
        color: rgba(0,0,0,.5);
        a{
            color: #eee;
        }
    }
    .ivu-btn-dashed,.ivu-btn-login{
        color: #57a3f3;
        line-height: 26px;
        background-color: #fff;
        border-color: #57a3f3;
        &:hover{
            color: #fff;
            background-color: #57a3f3;
        }
    }
    .ivu-btn,.ivu-input-group-append, 
    .ivu-checkbox-input,
    .ivu-input-group-prepend,.ivu-input{
        font-size: 14px;
        height: 42px;
        border-radius: 0!important;
    }
}
.code-item{
    .ivu-form-item-content{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .code-cont{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 35%;
        height: 42px;
        letter-spacing: 3px;
        border: 1px solid #dcdee2;
        font-size: 18px;
        cursor: pointer;
    }
}
</style>
