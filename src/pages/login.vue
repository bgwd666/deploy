<template>
    <div class="login animated" :class="shake ? `shake` : ''">
        <h2>会员管理系统</h2>
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom">
            <FormItem prop="username">
                <Input type="text" v-model="formCustom.username" clearable min="1" placeholder="请输入登录账号,一般为您的手机号" @keyup.native="show($event)">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="pwd">
                <Input type="password" v-model="formCustom.pwd" clearable  placeholder="请输入登录密码,如忘记请点击下方忘记密码" @keyup.native="show($event)">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="code" v-if="1" class="code-item">
                <Input type="text" style="width:60%;" v-model="formCustom.code" clearable  placeholder="请输入验证码" @keyup.native="show($event)">
                    <Icon type="ios-barcode" slot="prepend"></Icon> 
                </Input>
                <div @click="randomNum" :style="{ color: `#${randomCode}`}" class="code-cont">{{ randomCode }}</div>
            </FormItem>
            <FormItem style="margin-bottom: 5px;">
               <!-- <Checkbox v-model="formCustom.remember" disabled>记住登录密码</Checkbox> -->
                <a :href="`http://wpa.qq.com/msgrd?v=3&uin=2576471099&site=qq&menu=yes`" target="_blank" type="text" class="forget">忘记密码?</a>
            </FormItem>
            <FormItem class="submit">
                <Button type="primary" long @click="handleSubmit('formCustom')">登录系统</Button>
                <Button class="ivu-btn-register" long to="register">注册激活</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        data () {
            const username = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入您绑定的手机号码'));
                }else {
                    callback();
                }
            };
            const password = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入登录密码'));
                }else {
                    callback();
                }
            };
            const code = (rule, value, callback) => {            
                if (value !== this.randomCode) {
                    callback(new Error('验证码不对!'));
                    this.randomNum();
                }else {
                    callback();
                }
            };

            return {
                randomCode: null,
                shake: false,
                formCustom: {
                    username: '',
                    pwd: '',
                    remember: true,
                    code: ''
                },
                ruleCustom: {
                    username: [
                        { validator: username, trigger: 'blur' }
                    ],
                    pwd: [
                        { validator: password, trigger: 'blur' }
                    ],
                    code: [
                        { validator: code, trigger: 'blur' }
                    ]
                },
                info:[
                    {
                        mobile: '',
                        token: ''
                    }
                ]
            }
        },
        mounted() {
            this.randomNum();
            this.userinfo();
        },
        methods: {
            randomNum(){
                this.randomCode =  Math.random().toString(16).slice(-6);
            },
            show(event){
                let vm = this;
                if(event.keyCode == 13){
                    vm.login()
                }
                // 清空输入框
            },
            forget(){
                 this.$Message.info({
                    content: '账号为您的手机号码,如果忘记登录密码请联系管理员。',
                    duration: 5,
                });
            },
            login(){
                let vm =this;
                vm.axios.post('/login', {
                    mobile : vm.formCustom.username,
                    password : vm.formCustom.pwd
                })
                .then(function (res) {
                    let data = res.data;
                    if(res.status==200 && res.data.code == 0){
                        var info = {'token' : data.data.token};
                        var user = {'mobile': vm.formCustom.username,'password': vm.formCustom.pwd};
                        sessionStorage.setItem('userInfo', JSON.stringify(info));
                        localStorage.setItem('user', JSON.stringify(user));
                        vm.$router.push({ path: '/index' })
                    }else{
                        vm.$Message.error(data.message);
                        vm.shake = true;
                    }

                })
                .catch(function (error) {
                });
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    this.shake = false;
                    if (valid) {
                        this.login();
                    } else {
                        this.$Message.error('请将表单填写完整后再提交！');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            userinfo(){
                let data = JSON.parse(localStorage.getItem('user'));
                if(data){
                    this.formCustom.username = data.mobile;
                    this.formCustom.pwd = data.password;
                }
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
    &.animated{
        -webkit-animation-duration: .4s;
        animation-duration: .4s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
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
    .ivu-btn-dashed {
        color: #57a3f3;
        background-color: #fff;
        border-color: #57a3f3;
    }
    .ivu-btn,.ivu-input-group-append,
    .ivu-checkbox-input,
    .ivu-input-group-prepend,.ivu-input{
        border-radius: 0!important;
        height: 42px;
        font-size: 14px;
        outline: none;
        box-shadow: none;
    }
    .ivu-input-default{
        &:focus{
            box-shadow: 0 0 0 1px #2d8cf0;
        }
    }
    .ivu-form-item-error{
        .ivu-input-group-prepend{
            border-color: #dcdee2!important;
        }
        .ivu-input-default{
            &:focus{
                box-shadow: 0 0 0 1px #ed4014!important;
            }
        }
    }
}

.ivu-input::placeholder{
	color:LightCoral ;
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
