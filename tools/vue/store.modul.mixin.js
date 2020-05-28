import StoreMix from './store.mixin.js'
module.exports = {
    data(){
        return {
            view: false,
        }
    },    
    mixins: [ StoreMix ],
    props: {
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        form: {
            type: Object,
            default: null
        }
    },
    watch: {
        value(val){
            if(val){
                if(this.form){
                    this.$set(this.$data,'Params',this.form)
                }else{
                    this.DataReset('Params')
                }
                this.view = true
                this.init()
            }
        },
        view(val){
            if(!val) this.$emit('input',false);
        }
    },
    computed: {
        Title(){
            if(this.title) return this.title;
            if(this.$parent && this.$parent.Editer && this.$parent.Editer.title) return this.$parent.Editer.title;
        },
    },
    methods: {
        Cancel(){
            this.view = false
        }
    },
    created(){
        this.view = this.value
    }
}
