<template>
  <div>
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="activepage">客户列表</el-breadcrumb-item>
        <el-breadcrumb-item ></el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 列表主体部分 -->
    <el-card>
      
        <el-row :gutter="30">
            <el-col :span="10">
                <!-- 搜索栏 -->
                <el-input placeholder="请按客户姓名筛选" v-model="queryInfo.query" clearable @clear="getClientList">
                    <el-button slot="append" icon="iconfont icon-sousuo" @click="getClientList"></el-button>
                </el-input>
                <!-- 按钮 -->
            </el-col>
                <el-col :span="4">
                <el-button type="primary"  @click="addDialogVisible = true">信息添加</el-button>   
            </el-col> 
            
            <el-col :span="4">
                <el-select v-model="value" placeholder="意向用户筛选" @change="ClientLevelSelect(value)">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
            </el-col>      
        </el-row>

        <!-- 信息列表 -->
        <el-table  :data="clientList" border stripe :default-sort = "{order: 'descending'}">
            <el-table-column fixed type="index" label="序号" :index="indexMethod"  width="60" align="center" sortable></el-table-column>
            <!-- <el-table-column prop="clientid"   width="60" align="center" sortable></el-table-column> -->
            <el-table-column label="公司名称" prop="corporationname"  width="250" align="center" show-overflow-tooltip="true" sortable></el-table-column>            
            <el-table-column label="客户姓名" prop="clientname" width="180" align="center" show-overflow-tooltip="true" sortable></el-table-column>
            <el-table-column label="客户角色" prop="clientrole" width="180" align="center" show-overflow-tooltip="true" sortable></el-table-column>
            <el-table-column label="客户联系方式" prop="clienttelephone" width="250" align="center" sortable></el-table-column>
            <el-table-column label="面访情况" prop="clientinterview" width="250" align="center" sortable show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="意向客户等级" prop="clientlevel" width="180" align="center" sortable>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.clientlevel" placeholder="请选择" @change="ClientLevelChanged(scope.row)">
                        <el-option
                        v-for="item in options2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="320">
                <template slot-scope="scope">
                    <!-- 修改 -->
                    <el-tooltip effect="dark" content="编辑" placement="top-start" :enterable="false">
                        <el-button type="primary"  icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.clientid)"></el-button>
                    </el-tooltip>
                    <!-- 删除 -->
                    <el-tooltip effect="dark" content="删除" placement="top-start" :enterable="false">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteClient(scope.row.clientid)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        
        <!-- 分页组件 size-change:每页最大变化数 current-page:当前最大变化数 layout功能组件-->
        <div>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum"
                :page-sizes="[1, 5, 10, 100]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

    </el-card>

    <!-- 新增区域 -->
    <el-dialog title="添加信息" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px">
            <el-form-item label="客户姓名" prop="clientname">
                <el-input v-model="addForm.clientname"></el-input>
            </el-form-item>
            <el-form-item label="公司名称" prop="corporationname">
                <template>
                <el-select v-model="addForm.corporationname" clearable placeholder="请选择" 
                filterable
                allow-create>
                    <el-option
                    v-for="item in corporationNameList"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
                </template>
            </el-form-item>
            <el-form-item label="客户角色" prop="clientrole">
                <template>
                <el-select v-model="addForm.clientrole" clearable placeholder="请选择" 
                filterable
                allow-create>
                    <el-option
                    v-for="item in roleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                </template>
            </el-form-item>
            <el-form-item label="客户联系方式" prop="clienttelephone">
                <template>
                    <el-input v-model.number="addForm.clienttelephone"></el-input>
                </template>
            </el-form-item>
            <el-form-item label="面访情况" prop="clientinterview">
                <template>
                    <el-input v-model="addForm.clientinterview"></el-input>
                </template>
            </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addClient">确定</el-button>
        </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改物品信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
            <el-form-item label="客户姓名" prop="clientname">
                <el-input v-model="editForm.clientname"></el-input>
            </el-form-item>
            <el-form-item label="公司名称" prop="corporationname">
                <template>
                <el-select v-model="editForm.corporationname" clearable placeholder="请选择" 
                filterable
                allow-create>
                    <el-option
                    v-for="item in corporationNameList"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
                </template>
            </el-form-item>
            <el-form-item label="客户角色" prop="clientrole">
                <template>
                <el-select v-model="editForm.clientrole" clearable placeholder="请选择" 
                filterable
                allow-create>
                    <el-option
                    v-for="item in roleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                </template>
            </el-form-item>
            <el-form-item label="客户联系方式" prop="clienttelephone">
                <template>
                    <el-input v-model.number="editForm.clienttelephone"></el-input>
                </template>
            </el-form-item>
            <el-form-item label="面访情况" prop="clientinterview">
                <template>
                    <el-input v-model="editForm.clientinterview"></el-input>
                </template>
            </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="editClient">确定</el-button>
        </span>
        
    </el-dialog>
  </div>
</template>

<script>
export default {
  created(){
        this.getClientList();
        this.getCorporationNameList();
    },
  data(){
    return{
        roleOptions: [{
          value: '经办人',
          label: '经办人'
        }, {
          value: '小股东',
          label: '小股东'
        }, {
          value: '大股东',
          label: '大股东'
        }, {
          value: '办公室',
          label: '办公室'
        },
        {
          value: '法人',
          label: '法人'
        },
        {
          value: '网站备案负责人',
          label: '网站备案负责人'
        },
        {
          value: '其他',
          label: '其他'
        }],
        options: [{
          value: 0,
          label: '空'
        },{
          value: 1,
          label: 'A'
        }, {
          value: 2,
          label: 'B'
        }, {
          value: 3,
          label: 'C'
        },{
          value: 4,
          label: 'D'
        },{
          value: 5,
          label: '已成交'
        }
        ],
        options2: [{
          value: 1,
          label: 'A'
        }, {
          value: 2,
          label: 'B'
        }, {
          value: 3,
          label: 'C'
        },{
          value: 4,
          label: 'D'
        },{
          value: 5,
          label: '已成交'
        }
        ],
        value:"",
        url:'',
        name:'',
        value1:'',
      addFormRules: {
             clientname: [
                { required: true, message: '请输入客户姓名', trigger: 'change' },
                { min: 2, max: 30, message: '请输入2-30以内字符', trigger: 'blur'}
            ],
            clientrole: [
                { required: true, message: '请选择客户角色', trigger: 'change' }
            ],
            corporationname: [
                { required: true, message: '请选择公司名称', trigger: 'change' }
            ],
            clienttelephone: [
                { required: true, message: '请输入客户联系方式', trigger: 'change', },
                { type: 'number', message: '联系方式必须为数字值'},
                
            ],
      }, 
      // 修改表单验证
        editFormRules:{
            clientname: [
                { required: true, message: '请输入客户姓名', trigger: 'change' },
                { min: 2, max: 30, message: '请输入2-30以内字符', trigger: 'blur'}
            ],
            clientrole: [
                { required: true, message: '请选择客户角色', trigger: 'change' }
            ],
            corporationname: [
                { required: true, message: '请选择公司名称', trigger: 'change' }
            ],
            clienttelephone: [
                { required: true, message: '请输入客户联系方式', trigger: 'change', },
                
            ],
        },     
      addForm:{
            },
      editDialogVisible:false,
      editForm:{
                
            },
      addDialogVisible:false,
      queryInfo:{
                clientlevelInfo:0,
                query:"",
                pageNum:1,//当前页
                pageSize:5//每页最大数
            },
      clientList:[],
      corporationNameList:[],
      corporationRoleList:[],
      total:0,
      clientrole:'',
      corporationname:'',
    }
  },
  methods:{
        //是否成交
        async DealStateChanged(clientInfo){
            const {data:res} = await this.$http.put(`dealstate?id=${clientInfo.clientid}&isdeal=${clientInfo.isdeal}`);
            if (res!="success"){
               clientInfo.clientid = !clientInfo.clientid;
                return this.$message.error("状态修改失败！！！");
            }
            this.$message.success("状态修改成功!!!");
        },
        //显示对话框
      async showEditDialog(id){
          const {data:res} = await this.$http.get("getupdateclient?id="+id);
          this.editForm = res;
          this.editDialogVisible = true;
      },
  // 关闭窗口
      editDialogClosed(){
          this.$refs.editFormRef.resetFields();
      },
         async getClientList(){
            const {data:res} = await this.$http.get("allclient",{params:this.queryInfo});
            this.clientList = res.clients;
            this.total = res.clientCounts;
        },
         async getCorporationNameList(){
            const {data:res} = await this.$http.get("allcorporationname");
            this.corporationNameList = res.corporations;
            console.log(this.corporationNameList)
        },

        // pageNum触发动作
        handleCurrentChange(newPage){
            this.queryInfo.pageNum = newPage; 
            this.getClientList();   
        },
        // 最大数
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getClientList();
        },
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        }, 
        //添加信息
        addClient(){
            console.log(this.addForm);
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid)return;
                const {data:res} = await this.$http.post("addclient",this.addForm);
                if(res!="success"){
                    return this.$message.error("操作失败！！！");
                }
                this.$message.success("操作成功!!!");
                this.addDialogVisible = false;
                this.getClientList();      
            });
        },    
        // 确认修改
        editClient(){
            this.$refs.editFormRef.validate(async valid =>{
                if(!valid) return;
                const {data:res} = await this.$http.put("editclient",this.editForm);
                if(res!="success")return this.$message.error("操作失败！");
                this.$message.success("操作成功！");
                this.editDialogVisible = false;
                this.getClientList();
            })
        },
      //删除信息
      async deleteClient(id){
            const confirmResult = await this.$confirm("是否确定删除该数据","提示",{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }).catch(err => err)
            if(confirmResult!='confirm'){
                return this.$message.info("已撤销删除");
            }
            const {data:res} = await this.$http.delete("deleteclient?id="+id);
            if(res != "success"){
                return this.$message.error("删除失败！");
            }
            this.$message.success("删除成功！");
            this.getClientList();
        },
        // 用户意向等级修改
        async ClientLevelChanged(clientlevelInfo){
            const {data:res} = await this.$http.put(`clientlevel?clientid=${clientlevelInfo.clientid}&clientlevel=${clientlevelInfo.clientlevel}`);
            if (res!="success"){
                return this.$message.error("状态修改失败！！！");
            }
            this.$message.success("状态修改成功!!!");
        }, 
        // 根据用户意向等级查询数据
        async ClientLevelSelect(clientlevelInfo){
            console.log(clientlevelInfo)
            if(clientlevelInfo==0){
                this.getClientList();
            }else{
                this.queryInfo.clientlevelInfo=clientlevelInfo
                console.log("!!!",clientlevelInfo,this.queryInfo)
                const {data:res} = await this.$http.get("clientlevelselect",{params:this.queryInfo});
                this.clientList = res.clients;
                this.total = res.clientCounts;
            } 
        },
        indexMethod(index) {
            return index * 1;
        }
  }
}
</script>

<style scoped>

</style>