<template>
    <div id="login">
        <h1>Login</h1>
        <input type="text" name="username" v-model="input.username" placeholder="Username" />
        <input type="password" name="password" v-model="input.password" placeholder="Password" />
        <!--<input type="text" name="server" v-model="input.server" placeholder="Server" data-value="https://ipfc-midware.herokuapp.com/" readonly/>-->
        <button type="button" v-on:click="login()">Login</button>

              <ul v-if="errors && errors.length">
		<li v-for="error of errors" v-bind:key="error">
            {{error.message}}
            </li>
        </ul>
    </div>
</template>

<script>
    //import qs from 'qs'
    import axios from 'axios';
/*
    import VueLogger from 'vuejs-logger';
    const isProduction = process.env.NODE_ENV === 'production';

    const options = {
    isEnabled: true,
    logLevel : isProduction ? 'error' : 'debug',
    stringifyArguments : false,
    showLogLevel : true,
    showMethodName : true,
    separator: '|',
    showConsoleColors: true
    };
    default.use(VueLogger, options);
*/

    const getSalt = async (salt_uri, username) => {
    console.log("Getting salt from "+salt_uri+" with "+username);
    try{
    const response = await axios({
    method: 'get',
    mode: 'no-cors', 
    url: salt_uri,
    data: {},
    //data: qs.stringify({
    // email: username}),
    headers: {
     'Content-Type': "application/x-www-form-urlencoded",
     'Accept': "*/*",
     'email': encodeURIComponent(username)} 
    });

    console.log(response)
    return response;
    } catch (error){
    console.log("Error! "+ error);
    }
    }
    

    export default {
        name: 'Login',
        data() {
            return {
                errors: [],
                input: {
                    username: "",
                    password: "",
                    server: ""
                }
            }
        },
        methods: {
            async login(){
                // why does this not work?
                let server = "https://ipfc-midware.herokuapp.com/";

                //local proxy:
                //let server = "http://localhost:8010/";
		
                let salt_uri = server + 'getsalt';
                console.log("Salting (?) @ "+ salt_uri);

    const loginSalt = await getSalt(salt_uri, this.input.username);
    console.log("We got "+ loginSalt);
                //from https://alligator.io/vuejs/rest-api-axios/
                let authReq = {
                    'user': this.input.username,
                    'password': this.input.password
                }
                axios.post(server, {
                    body: authReq
                })
                .then(response => {
                    console.log(response);
                })
                .catch(e => {
                    this.errors.push(e)
                })


                /*try {
                    await axios.post(this.input.server, {
                          body: this.postBody
                    })
                } catch (e) {
                   this.errors.push(e)
                }
                */

                /**if(this.input.username != "" && this.input.password != "") {
                    if(this.input.username == this.$parent.mockAccount.username && this.input.password == this.$parent.mockAccount.password) {
                        this.$emit("authenticated", true);
                        this.$router.replace({ name: "secure" });
                    } else {
                        console.log("The username and / or password is incorrect");
                    }
                } else {
                    console.log("A username and password must be present");
                }*/
            }
        }
    }
 </script>

<style scoped>
    #login {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #FFFFFF;
        margin: auto;
        margin-top: 200px;
        padding: 20px;
    }
</style>
