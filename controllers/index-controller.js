const IS_DEVELOPMENT = false
const TIMELINE_AUTOSAVE_LOCALSTORAGE_KEY = 'pc17-clan-battle-timeline-autosave'

var app = new Vue({
    el: '#app',
    data: {
        charas: [],
        selectedCharas: [],
        timeline: [],
        result: [],
        thIsTime: true,
    },
    mounted: function() {
        if (IS_DEVELOPMENT) {
            let autosave = JSON.parse(localStorage.getItem(TIMELINE_AUTOSAVE_LOCALSTORAGE_KEY))
            this.selectedCharas = autosave.selectedCharas
            this.timeline = autosave.timeline
        }

        this.charas = this.getCharas({ orderBy: 'location' })
    },
    methods: {
        getCharas: function(params) {
            let charas = CHARAS

            if (params) Object.keys(params).forEach(p => {
                switch (p) {
                    case 'orderBy':
                        let value = params[p]
                        charas.sort((a, b) => a[value] - b[value])
                        break;
                    
                    case 'name':
                        charas = charas.filter(c => c.name == params.name)
                        break
                }
            })

            charas.forEach(c => {
                c.imgSrc = `./static/charaicons/${c.name}.webp`
            })

            return charas
        },
        getCharaIconSrc: function(chara) {
            return `./static/charaicons/${chara.name}.webp`
        },
        selectChara: function(chara) {
            if (this.charaIsSelected(chara)) {
                this.deselectChara(chara)
            }
            else if (this.selectedCharas.length == 5) {
                alert("一个队伍最多5个角色")
            }
            else {
                this.selectedCharas.push(chara)
                this.selectedCharas.sort((a, b) => b.location - a.location)
            }
        },
        deselectChara: function(chara) {
            let index = this.selectedCharas.indexOf(chara)
            this.selectedCharas.splice(index, 1)
        },
        charaIsSelected: function(chara) {
            return this.selectedCharas.some(c => c.name == chara.name)
        },
        getTh: function() {
            let th = []
            for (let i = 90; i > 0; i--) {
                if (this.thIsTime) {
                    let minute = parseInt(i / 60)
                    let second = i % 60
                    th.push(`${minute}:${second < 10 ? '0' + second : second}`)
                }
                else {
                    th.push(i < 10 ? '0' + i : i)
                }
            }
            return th
        }
    },
    watch: {
        timeline: function() {
            if (IS_DEVELOPMENT) {
                localStorage.setItem(TIMELINE_AUTOSAVE_LOCALSTORAGE_KEY, JSON.stringify({
                    selectedCharas: this.selectedCharas,
                    timeline: this.timeline
                }))
            }

            let data = this.timeline

            let skillNames = []
            let result = []

            data.forEach(item => {
                if (!skillNames.some(n => n == item.name)) {
                    skillNames.push(item.name)
                }
            })

            skillNames.forEach(n => {
                let t = data.filter(item => item.name == n)
                let timeline = t.map(({ useTime }) => useTime.minute * 60 + useTime.second)
                result.push({
                    charaName: t[0].charaName,
                    skillName: t[0].name,
                    time: t[0].time,
                    timeline,
                })
            })

            this.result = result
        }
    },
    filters: {
        useTimeToString: function(value) {
            let minute = value.minute
            let second = value.second < 10 ? '0' + value.second : value.second
            return `${minute}:${second}` 
        }
    }
})
