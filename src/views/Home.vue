
<template>
    <div class="home"
         v-loading="loading"
         element-loading-text="loading..."
         element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="flex-width-box">
            <div class="user-aside fix-width">
                <div class="user-search">
                    <el-input v-model="userName" clearable @clear="userNameChange" @change="userNameChange"
                              placeholder="Please enter name"/>
                    <el-radio-group v-model="gender" @change="genderChange">
                        <el-radio label="male">male</el-radio>
                        <el-radio label="female">female</el-radio>
                    </el-radio-group>
                    <el-button class="reset-btn" type="primary" @click="reset">reset</el-button>
                </div>
                <div class="user-list" @scroll="scroll" ref="infiniteList" style=" overflow-x: hidden;
    overflow-y: auto;">
                    <ul v-if="this.userHistoryList.length > 0" class="infinite-list">
                        <li v-for="(item, index) in userHistoryList" :key="index" class="infinite-item"
                            :class="item.email===email?'active':''" @click="userChange(item)">
                            <el-image class="item-avatar" :key="item.picture.large" :src="item.picture.large" lazy/>
                            <div class="item-info">
                                <div class="name">{{ item.name.first }} {{ item.name.last }}</div>
                                <div class="email">{{ item.email }}</div>
                            </div>
                        </li>
                        <div class="more" @click="moreData">More results...</div>
                    </ul>
                    <el-empty v-else description="Empty"></el-empty>
                </div>
            </div>
            <div class="user-content auto-full-width">
                <template v-if="this.userHistoryList.length > 0">
                    <div class="top">
                        <img v-if="userInfo.picture" class="top-avatar" :src="userInfo.picture.large" alt="user-logo">
                        <div v-if="userInfo.picture" class="top-info">
                            <div class="name">{{ userInfo.name.first }} {{ userInfo.name.last }}</div>
                            <p>{{ userInfo.id.name }} {{ userInfo.id.value }}</p>
                            <p>{{ userInfo.email }}</p>
                        </div>
                    </div>
                    <div class="lower">
                        <p><span class="label">cell：</span>{{ userInfo.cell }}</p>
                        <p><span class="label">phone：</span>{{ userInfo.phone }}</p>
<!--                        <p><span class="label">gender：</span>{{ userInfo.gender }}</p>-->
<!--                        <p><span class="label">nat：</span>{{ userInfo.nat }}</p>-->
                        <template v-if="userInfo.location">
                            <p><span class="label">city：</span>{{ userInfo.location.city }}</p>
                            <p><span class="label">country：</span>{{ userInfo.location.country }}</p>
                            <p><span class="label">state：</span>{{ userInfo.location.state }}</p>
                            <p><span class="label">street：</span>{{ userInfo.location.street.name }}
                                {{ userInfo.location.street.number }}</p>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <el-empty description="Empty"></el-empty>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: 'Home',
    data() {
        return {
            loading: false,
            page: 1,
            historyPage: 1,
            userName: '',
            gender: '',
            pos: 0,  // scroll bar position
            email: '',
            userList: [], // user data
            userHistoryList: [], // history user data
            userInfo: {} // Check User Information
        }
    },
    created() {
        let userName = window.localStorage.getItem("userName");
        let gender = window.localStorage.getItem("gender");
        let email = window.localStorage.getItem("email");
        let userInfo = window.localStorage.getItem("userInfo");
        let page = window.localStorage.getItem("page");
        let list = window.localStorage.getItem("list");
        if (userName && userName !== '') {
            this.userName = userName;
        }
        if (gender && gender !== '') {
            this.gender = gender;
        }
        if (email && email !== '') {
            this.email = email;
            this.userInfo = JSON.parse(userInfo);
        }
        if (page && page !== '') {
            this.page = Number(page) + 1;
            this.userList = JSON.parse(list)
            this.userHistoryList = JSON.parse(list);
            this.scrollToBottom();
        } else {
            this.getList(1, 25, 'reset');
        }
    },
    methods: {
        /** get user list */
        getList(page, num, reset) {
            let pageNum = page ? page : this.page;
            let results = num ? num : 25;
            this.loading = true;
            axios.get('https://randomuser.me/api/', {
                params: {
                    page: pageNum,
                    seed: "seed",
                    nat: "us",
                    exc: 'login,registered,dob',
                    results: results,
                    gender: this.gender,
                }
            }).then((res) => {
                this.userList = page ? res.data.results : this.userList.concat(res.data.results);
                window.localStorage.setItem("list", JSON.stringify(this.userList));
                this.userHistoryList = [...this.userList];
                if (this.email === '') {
                    this.email = JSON.parse(JSON.stringify(this.userList[0])).email;
                    this.userInfo = JSON.parse(JSON.stringify(this.userList[0]));
                    window.localStorage.setItem("email", this.email);
                    window.localStorage.setItem("userInfo", JSON.stringify(this.userList[0]));
                }
                window.localStorage.setItem("page", this.page);
                this.page = this.page + 1;
                this.scrollToBottom();
                if(!reset) {
                    this.filterData();
                }
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
                console.log(err)
            })
        },
        /** reset method */
        reset() {
            this.userName = '';
            this.gender = '';
            this.page = 1;
            this.pos = 0;
            this.email = JSON.parse(JSON.stringify(this.userList[0])).email;
            this.userInfo = JSON.parse(JSON.stringify(this.userList[0]));
            window.localStorage.setItem("page", this.page);
            window.localStorage.setItem("email", this.email);
            window.localStorage.setItem("userInfo", JSON.stringify(this.userList[0]));
            window.localStorage.setItem("userName", this.userName);
            window.localStorage.setItem("gender", this.gender)
            window.localStorage.setItem("pos", this.pos);
            this.getList(1, 25, 'reset');
        },
        /** Set scrollbar position */
        scrollToBottom() {
            let pos = Number(window.localStorage.getItem("pos"));
            this.$nextTick(() => {
                let container = document.querySelector('.user-list');
                container.scrollTop = pos;
            })
        },
        /** get scrollbar position */
        scroll(event) {
            this.pos = event.target.scrollTop;
            window.localStorage.setItem("pos", this.pos);
        },
        /** View more user data */
        moreData() {
            let pageNum = this.page;
            this.loading = true;
            axios.get('https://randomuser.me/api/', {
                params: {
                    page: pageNum,
                    seed: "seed",
                    nat: "us",
                    exc: 'login,registered,dob',
                    results: 25,
                    gender: this.gender,
                }
            }).then((res) => {
                this.userList = this.userList.concat(res.data.results);
                window.localStorage.setItem("list", JSON.stringify(this.userList)); //Store user data
                this.userHistoryList = [...this.userList];
                if (this.email === '') {
                    this.email = JSON.parse(JSON.stringify(this.userList[0])).email;
                    this.userInfo = JSON.parse(JSON.stringify(this.userList[0]));
                    window.localStorage.setItem("email", this.email);
                    window.localStorage.setItem("userInfo", JSON.stringify(this.userList[0]));
                }
                window.localStorage.setItem("page", this.page); //Store current page
                this.page = this.page + 1;
                this.filterData(1);  //filter user data
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
                console.log(err)
            })
        },
        /** userName Search */
        userNameChange() {
            window.localStorage.setItem("userName", this.userName); //Store search userName
            this.filterData(1);
        },
        /** gender Search */
        genderChange() {
            window.localStorage.setItem("gender", this.gender); //Store search gender
            this.filterData(1);
        },
        /** Filter data locally */
        filterData(status) {
            let userHistoryList =  !status ? JSON.parse(this.userHistoryList): this.userHistoryList;
            if (this.userName !== '') {
                userHistoryList = userHistoryList.filter(item => item.name.first.toLowerCase().indexOf(this.userName.toLowerCase()) !== -1 || item.name.last.toLowerCase().indexOf(this.userName.toLowerCase()) !== -1)
            }
            if (this.gender !== '') {
                userHistoryList = userHistoryList.filter(item => item.gender === this.gender)
            }
            if (this.userName === '' && this.gender === '') {
                userHistoryList = this.userList;
            }
            this.userHistoryList = userHistoryList;
            window.localStorage.setItem("list", JSON.stringify(this.userHistoryList)); //Store user data
            let emailArr = this.userHistoryList.map(item => item.email);
            if (this.userHistoryList.length > 0 && !emailArr.includes(this.email)) {
                this.email = this.userHistoryList[0].email;
                this.userInfo = this.userHistoryList[0];
            }
        },
        /** User selection method */
        userChange(data) {
            let baseData = JSON.parse(JSON.stringify((data)))
            this.email = baseData.email;
            this.userInfo = baseData;
            window.localStorage.setItem("email", this.email);
            window.localStorage.setItem("userInfo", JSON.stringify(baseData));
        }
    }
}
</script>
