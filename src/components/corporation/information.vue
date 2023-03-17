<template>
  <div>
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="activepage">公司列表</el-breadcrumb-item>
        <el-breadcrumb-item ></el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 列表主体部分 -->
    <el-card>
      
        <el-row :gutter="30">
            <el-col :span="10">
                <!-- 搜索栏 -->
                <el-input placeholder="请按公司名称搜索" v-model="queryInfo.query" clearable @clear="getCorporationList">
                    <el-button slot="append" icon="iconfont icon-sousuo" @click="getCorporationList"></el-button>
                </el-input>
                <!-- 按钮 -->
            </el-col>
                <el-col :span="4">
                <el-button type="primary"  @click="addDialogVisible = true">信息添加</el-button>   
            </el-col>       
        </el-row>

        <!-- 信息列表 -->
        <el-table  :data="corporationList" border  :default-sort = "{ order: 'descending'}" :row-class-name="tableRowClassName">
            <el-table-column fixed type="index" label="序号" :index="indexMethod"  width="60" align="center" sortable></el-table-column>
            <el-table-column fixed label="id" prop="corporationid"  width="60" align="center" sortable></el-table-column>
            <el-table-column fixed label="公司名称" prop="corporationname"  width="240" align="center" show-overflow-tooltip="true" sortable>
                <template slot-scope="scope"><!--数据模板-->
                    <el-popover
                    placement="right"
                    width="850"
                    trigger="click">
                     <el-table :data="ClientList">
                        <el-table-column width="150" property="clientname" label="姓名"></el-table-column>
                        <el-table-column width="150" property="clientrole" label="职位"></el-table-column>
                        <el-table-column width="200" property="clienttelephone" label="联系方式" show-overflow-tooltip="true"></el-table-column>
                        <el-table-column width="200" property="clientinterview" label="面访情况" show-overflow-tooltip="true"></el-table-column>
                        <el-table-column width="150" property="clientlevel" label="意向等级">
                            <template slot-scope="scope">
                                {{scope.row.clientlevel | levelFromat}}
                            </template>
                        </el-table-column>
                    </el-table>
                        <el-button slot="reference" @click="getClientList(scope.row.corporationname)">{{scope.row.corporationname}}</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column fixed label="公司地址" prop="corporationaddress" width="180" align="center" show-overflow-tooltip="true" sortable></el-table-column>
            <el-table-column fixed label="是否拜访" prop="isvisit" width="120" align="center" sortable>
                <!--作用域插槽 scope.row 存储了当前行的信息 -->
                <template slot-scope="scope"><!--数据模板-->
                    <el-switch v-model="scope.row.isvisit" @change="VisitStateChanged(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column fixed label="跟进信息1" prop="corporationsupplement1" width="180" align="center"  show-overflow-tooltip="true"></el-table-column>
            <el-table-column fixed label="跟进信息2" prop="corporationsupplement2" width="180" align="center"  show-overflow-tooltip="true"></el-table-column>
            <el-table-column fixed label="操作" align="center" width="150">
                <template slot-scope="scope">
                    <!-- <el-tooltip effect="dark" content="查看" placement="top-start" :enterable="false">
                        <el-button  type="primary" @click="showCheckDialog(scope.row)" icon="el-icon-edit" size="mini"></el-button>
                    </el-tooltip> -->
                    <!-- 修改 -->
                    <el-tooltip effect="dark" content="编辑" placement="top-start" :enterable="false">
                        <el-button type="primary"  icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.corporationid)"></el-button>
                    </el-tooltip>
                    <!-- 删除 -->
                    <el-tooltip effect="dark" content="删除" placement="top-start" :enterable="false">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCorporation(scope.row.corporationid)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="招投标" prop="corporationbidding" width="120" align="center" sortable>
                <!--作用域插槽 scope.row 存储了当前行的信息 -->
                <template slot-scope="scope"><!--数据模板-->
                    <el-switch v-model="scope.row.corporationbidding" @change="biddingStateChanged(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="实缴/注册" prop="corporationactualpayment" width="150" align="center" sortable>
                <template  slot-scope="scope"  ><!--数据模板-->
                    {{scope.row.corporationactualpayment}}/{{scope.row.corporationregister}}
                </template>
            </el-table-column>
            <el-table-column label="社保人数" prop="corporationsocialsecuritynumber" width="90" align="center" sortable></el-table-column>  
            <el-table-column label="高新到期时间" prop="corporationgxdqdate" width="120" align="center" sortable>
                <template  slot-scope="scope"  ><!--数据模板-->
                    {{scope.row.corporationgxdqdate  | yearFormatDate}}
                </template>
            </el-table-column>
            <el-table-column label="高企认证次数" prop="corporationcertification" width="60" align="center" sortable></el-table-column>
            <el-table-column label="软企到期时间" prop="corporationrqdqdate" width="150" align="center" sortable>
                <template slot-scope="scope"><!--数据模板-->
                    {{scope.row.corporationrqdqdate  | dateFormatDate}}
                </template>
            </el-table-column>
            <el-table-column label="ISO9001" prop="corporationISO9001" width="150" align="center" sortable show-overflow-tooltip="true">
                <template slot-scope="scope"><!--数据模板-->
                    {{scope.row.corporationISO9001  | datesFormatDate}}
                </template>
            </el-table-column>
            <el-table-column label="ISO20000" prop="corporationISO20000" width="150" align="center" sortable >
                <template slot-scope="scope"><!--数据模板-->
                    {{scope.row.corporationISO20000  | dateFormatDate}}
                </template>
            </el-table-column>
            <el-table-column label="ISO27000" prop="corporationISO27000" width="150" align="center" sortable >
                <template slot-scope="scope"><!--数据模板-->
                    {{scope.row.corporationISO27000  | dateFormatDate}}
                </template>
            </el-table-column>
            <el-table-column label="五星售后" prop="corporationfivestar" width="150" align="center" sortable>
                <template slot-scope="scope"><!--数据模板-->
                    {{scope.row.corporationfivestar  | dateFormatDate}}
                </template>
            </el-table-column>
            <el-table-column label="两化融合" prop="corporationcombination" width="150" align="center" sortable>
                <template slot-scope="scope"><!--数据模板-->
                    {{scope.row.corporationcombination  | dateFormatDate}}
                </template>
            </el-table-column>
            <el-table-column label="贯标" prop="corporationjitc" width="150" align="center" sortable>
                <template slot-scope="scope"><!--数据模板-->
                    {{scope.row.corporationjitc  | dateFormatDate}}
                </template>
            </el-table-column>
            <el-table-column label="3C" prop="corporation3C" width="150" align="center" sortable show-overflow-tooltip="true">
                <template slot-scope="scope"><!--数据模板-->
                    {{scope.row.corporation3C  | datesFormatDate}}
                </template>
            </el-table-column>
            <el-table-column label="其它" prop="corporationelse" width="180" align="center"  show-overflow-tooltip="true"></el-table-column>
        </el-table>
        
        <!-- 分页组件 size-change:每页最大变化数 current-page:当前最大变化数 layout功能组件-->
        <div>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum"
                :page-sizes="[1, 5,10, 100]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

    </el-card>

    <!-- 新增区域 -->
    <el-dialog title="添加信息" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <el-form-item label="公司名称" prop="corporationname">
                <el-input v-model="addForm.corporationname"></el-input>
            </el-form-item>
            <el-form-item label="公司地址" prop="corporationaddress">
                <el-input v-model="addForm.corporationaddress"></el-input>
            </el-form-item>
            <el-form-item label="实缴数" prop="corporationactualpayment">
                <template>
                    <el-input-number v-model="addForm.corporationactualpayment" :precision="1" :step="0.5" :min="0"></el-input-number>
                </template>
            </el-form-item>
            <el-form-item label="注册数" prop="corporationregister">
                <template>
                    <el-input-number v-model="addForm.corporationregister" :precision="1" :step="0.5" :min="0"></el-input-number>
                </template>
            </el-form-item>
            <el-form-item label="社保人数" prop="corporationsocialsecuritynumber">
                <template>
                    <el-input-number v-model="addForm.corporationsocialsecuritynumber" :min="0" ></el-input-number>
                </template>
            </el-form-item>
            <el-form-item label="高新到期时间" prop="corporationgxdqdate">
                <template>
                    <div class="block">
                        <span class="demonstration">年</span>
                        <el-date-picker
                        v-model="addForm.corporationgxdqdate"
                        type="year"
                        placeholder="选择年"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="高企认证次数" prop="corporationcertification">
                <template>
                    <el-input-number v-model="addForm.corporationcertification" :min="0" :max="2"></el-input-number>
                </template>
            </el-form-item>
            <el-form-item label="软企到期时间" prop="corporationrqdqdate">
                <template >
                    <div class="block">
                        <span class="demonstration">日期</span>
                        <el-date-picker
                        v-model="addForm.corporationrqdqdate"
                        type="datetime"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </template>
            </el-form-item>
             <el-form-item label="ISO9001" prop="corporationISO9001" >
                <template>
                    <div class="block">
                    <span class="demonstration">多个日期</span>
                    <el-date-picker
                    type="dates"
                    v-model="addForm.corporationISO9001"
                    placeholder="选择一个或多个日期"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="3C" prop="corporation3C" >
                <template>
                    <div class="block">
                    <span class="demonstration">多个日期</span>
                    <el-date-picker
                    type="dates"
                    v-model="addForm.corporation3C"
                    placeholder="选择一个或多个日期"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="ISO20000" prop="corporationISO20000">
                <template>
                    <div class="block">
                    <span class="demonstration">日期</span>
                    <el-date-picker
                    type="datetime"
                    v-model="addForm.corporationISO20000"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="ISO27000" prop="corporationISO27000">
                <template>
                    <div class="block">
                    <span class="demonstration">日期</span>
                    <el-date-picker
                    type="datetime"
                    v-model="addForm.corporationISO27000"
                    placeholder="选择一个或多个日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="五星售后" prop="corporationfivestar">
                <template>
                    <div class="block">
                        <span class="demonstration">日期</span>
                        <el-date-picker
                        v-model="addForm.corporationfivestar"
                        type="datetime"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="两化融合" prop="corporationcombination">
                <template>
                    <div class="block">
                        <span class="demonstration">日期</span>
                        <el-date-picker
                        v-model="addForm.corporationcombination"
                        type="datetime"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="贯标" prop="corporationjitc">
                <template>
                    <div class="block">
                        <span class="demonstration">日期</span>
                        <el-date-picker
                        v-model="addForm.corporationjitc"
                        type="datetime"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="跟进信息1" prop="corporationsupplement1">
                <el-input v-model="addForm.corporationsupplement1"></el-input>
            </el-form-item>
            <el-form-item label="跟进信息2" prop="corporationsupplement2">
                <el-input v-model="addForm.corporationsupplement2"></el-input>
            </el-form-item>
            <el-form-item label="其他信息" prop="corporationelse">
                <el-input v-model="addForm.corporationelse"></el-input>
            </el-form-item>           

        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addCorporation">确定</el-button>
        </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
            <el-form-item label="公司名称" prop="corporationname">
                <el-input v-model="editForm.corporationname"></el-input>
            </el-form-item>
            <el-form-item label="公司地址" prop="corporationaddress">
                <el-input v-model="editForm.corporationaddress"></el-input>
            </el-form-item>
            <el-form-item label="实缴数" prop="corporationactualpayment">
                <template>
                    <el-input-number v-model="editForm.corporationactualpayment" :precision="1" :step="0.5" :min="0"></el-input-number>
                </template>
            </el-form-item>
            <el-form-item label="注册数" prop="corporationregister">
                <template>
                    <el-input-number v-model="editForm.corporationregister" :precision="1" :step="0.5" :min="0"></el-input-number>
                </template>
            </el-form-item>
            <el-form-item label="社保人数" prop="corporationsocialsecuritynumber">
                <template>
                    <el-input-number v-model="editForm.corporationsocialsecuritynumber" :min="0" ></el-input-number>
                </template>
            </el-form-item>
            <el-form-item label="高新到期时间" prop="corporationgxdqdate">
                <template>
                    <div class="block">
                        <span class="demonstration">年</span>
                        <el-date-picker
                        v-model="editForm.corporationgxdqdate"
                        type="year"
                        placeholder="选择年"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="高企认证次数" prop="corporationcertification">
                <template>
                    <el-input-number v-model="editForm.corporationcertification" :min="0" :max="2"></el-input-number>
                </template>
            </el-form-item>
            <el-form-item label="软企到期时间" prop="corporationrqdqdate">
                <template >
                    <div class="block">
                        <span class="demonstration">日期</span>
                        <el-date-picker
                        v-model="editForm.corporationrqdqdate"
                        type="datetime"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </template>
            </el-form-item>
             <el-form-item label="ISO9001" prop="corporationISO9001">
                <template>
                    <div class="block">
                    <span class="demonstration">多个日期</span>
                    <el-date-picker
                    type="dates"
                    v-model="editForm.corporationISO9001"
                    placeholder="选择一个或多个日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="3C" prop="corporation3C">
                <template>
                    <div class="block">
                    <span class="demonstration">多个日期</span>
                    <el-date-picker
                    type="dates"
                    v-model="editForm.corporation3C"
                    placeholder="选择一个或多个日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="ISO20000" prop="corporationISO20000">
                <template>
                    <div class="block">
                    <span class="demonstration">日期</span>
                    <el-date-picker
                    type="datetime"
                    v-model="editForm.corporationISO20000"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="ISO27000" prop="corporationISO27000">
                <template>
                    <div class="block">
                    <span class="demonstration">日期</span>
                    <el-date-picker
                    type="datetime"
                    v-model="editForm.corporationISO27000"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="五星售后" prop="corporationfivestar">
                <template>
                    <div class="block">
                        <span class="demonstration">日期</span>
                        <el-date-picker
                        v-model="editForm.corporationfivestar"
                        type="datetime"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="两化融合" prop="corporationcombination">
                <template>
                    <div class="block">
                        <span class="demonstration">日期</span>
                        <el-date-picker
                        v-model="editForm.corporationcombination"
                        type="datetime"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="贯标" prop="corporationjitc">
                <template>
                    <div class="block">
                        <span class="demonstration">日期</span>
                        <el-date-picker
                        v-model="editForm.corporationjitc"
                        type="datetime"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="跟进信息1" prop="corporationsupplement1">
                <el-input v-model="editForm.corporationsupplement1"></el-input>
            </el-form-item>
            <el-form-item label="跟进信息2" prop="corporationsupplement2">
                <el-input v-model="editForm.corporationsupplement2"></el-input>
            </el-form-item>
            <el-form-item label="其他信息" prop="corporationelse">
                <el-input v-model="editForm.corporationelse"></el-input>
            </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="editCorporation">确定</el-button>
        </span>
        
    </el-dialog>
  </div>
</template>

<script>
export default {
  created(){
        this.getCorporationList();
        this.getClientList();
    },
    watch: {
      'editForm.corporationgxdqdate'(val) {
        this.editForm.corporationgxdqdate= '' + val;
      },
      'editForm.corporationrqdqdate'(val) {
        this.editForm.corporationrqdqdate= '' + val;
      },
    //   'editForm.corporationISO9001'(val) {
    //     this.editForm.corporationISO9001= '' + val;
    //   },
      'editForm.corporationISO20000'(val) {
        this.editForm.corporationISO20000= '' + val;
      },
      'editForm.corporationISO27000'(val) {
        this.editForm.corporationISO27000= '' + val;
      },
      'editForm.corporationfivestar'(val) {
        this.editForm.corporationfivestar= '' + val;
      },
      'editForm.corporationcombination'(val) {
        this.editForm.corporationcombination= '' + val;
      },
      'editForm.corporationjitc'(val) {
        this.editForm.corporationjitc= '' + val;
      },
    },
  data(){
    return{
        ClientList:{},
        url:'',
        name:'',
        value1:'',
      addFormRules: {
            corporationname: [
                { required: true, message: '请输入公司名称', trigger: 'change' },
                { min: 2, max: 30, message: '请输入2-30字以内信息', trigger: 'blur'}
            ],
            corporationaddress: [
                { required: true, message: '请输入公司具体地址', trigger: 'change' },
                { min: 2, max: 30, message: '请输入2-30字以内信息', trigger: 'blur'}
            ],
      }, 
      // 修改表单验证
        editFormRules:{
        corporationname: [
                { required: true, message: '请输入公司名称', trigger: 'change' },
                { min: 2, max: 30, message: '请输入2-30字以内信息', trigger: 'blur'}
            ],
            corporationaddress: [
                { required: true, message: '请输入公司具体地址', trigger: 'change' },
                { min: 2, max: 30, message: '请输入2-30字以内信息', trigger: 'blur'}
            ],
        },     
      //添加商品
      addForm:{
            },
      editDialogVisible:false,
      editForm:{
            },
      addDialogVisible:false,
      queryInfo:{
                query:"",
                pageNum:1,//当前页
                pageSize:10//每页最大数
            },
      corporationList:[],
      total:0,
      nowdate:{},
    }
  },
  filters:{
      yearFormatDate: function (value) {//调用时间戳为日期显示
      		let date = new Date(value)
      		let y = date.getFullYear()  //获取年份
              if(value&&value!=946656000000){
                  return y + "年" 
              }else
      		  return "无"
      },
      dateFormatDate: function (value) {//调用时间戳为日期显示
      		let date = new Date(value)
      		let y = date.getFullYear()  //获取年份
      		let m = date.getMonth() + 1  //获取月份
      		m = m < 10 ? "0" + m : m  //月份不满10天显示前加0
      		let d = date.getDate()  //获取日期
      		d = d < 10 ? "0" + d : d  //日期不满10天显示前加0
            if(value&&value!=946656000000){
                return y + "年" + m + "月" + d + "日"
            }else
            return "无"
    	},
        datesFormatDate: function (value) {//调用时间戳为日期显示
            if(value!='undefined'&&value!='null'){
                return value
            }else 
            return "无"
    	},
        levelFromat: function(value){
            if(value==0){
                return '空'
            }else if(value==1){
                return 'A'
            }
            else if(value==2){
                return 'B'
            }
            else if(value==3){
                return 'C'
            }
            else if(value==4){
                return 'D'
            }else if(value==5){
                return '已成交'
            }
        }
  },
  methods:{

      FormatDate(value){
          let date = new Date(value)
      		let y = date.getFullYear()  //获取年份
      		let m = date.getMonth() + 1  //获取月份
      		m = m < 10 ? "0" + m : m  //月份不满10天显示前加0
      		let d = date.getDate()  //获取日期
      		d = d < 10 ? "0" + d : d  //日期不满10天显示前加0
            if(value){
                return y + "-" + m + "-" + d 
            }else
            return "2000-01-01"
      },
      FormatDates(value){
          if(value!="undefined"&&value!="null"){
              return value
          }else{
              return ""
          }
      },
        //显示修改对话框
      async showEditDialog(id){
          const {data:res} = await this.$http.get("getupdatecorporation?id="+id);
          this.editForm = res;
          this.editDialogVisible = true;
          this.editForm.corporationgxdqdate=this.FormatDate(this.editForm.corporationgxdqdate);
          this.editForm.corporationrqdqdate=this.FormatDate(this.editForm.corporationrqdqdate);
          this.editForm.corporationfivestar=this.FormatDate(this.editForm.corporationfivestar);
          this.editForm.corporationcombination=this.FormatDate(this.editForm.corporationcombination);
          this.editForm.corporationjitc=this.FormatDate(this.editForm.corporationjitc);
          this.editForm.corporationISO9001=this.FormatDates(this.editForm.corporationISO9001);
          this.editForm.corporation3C=this.FormatDates(this.editForm.corporation3C);
          this.editForm.corporationISO20000=this.FormatDate(this.editForm.corporationISO20000);
          this.editForm.corporationISO27000=this.FormatDate(this.editForm.corporationISO27000);
          console.log(res,"RES")
      },
  // 关闭窗口
      editDialogClosed(){
          this.$refs.editFormRef.resetFields();
      },
      //将string转为日期
      stringToDate(dateStr,separator){
          console.log(dateStr,"dateStr")
    	if(dateStr=="null"||dateStr=="undefined"){
    		return 0;
    	}
        if(!separator){
               separator="-";
        }
        var dateArr = dateStr.split(separator);
        var year = parseInt(dateArr[0]);
        var month;                     
        if(dateArr[1].indexOf("0") == 0){
            month = parseInt(dateArr[1].substring(1));
        }else{
             month = parseInt(dateArr[1]);
        }
        var day = parseInt(dateArr[2]);
        var date = new Date(year,month -1,day).getTime();
        return date;
    },
     async getCorporationList(){
            const {data:res} = await this.$http.get("allcorporation",{params:this.queryInfo});
            this.corporationList = res.corporations;
            this.total = res.corporationCounts;
            console.log(this.corporationList,"this.corporationList")
            for(let i=0;i<this.corporationList.length;i++){
            if(this.corporationList[i].corporationrqdqdate!=946656000000&&this.corporationList[i].corporationrqdqdate-new Date().getTime()<10368000000)
                {
                    const confirmResult = await this.$confirm("id为"+this.corporationList[i].corporationid+"的"+this.corporationList[i].corporationname+"软企时间即将到期","快到期提醒",{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                    })
                }
                if(this.corporationList[i].corporationISO20000!=946656000000&&this.corporationList[i].corporationISO20000-new Date().getTime()<10368000000)
                {
                    const confirmResult = await this.$confirm("id为"+this.corporationList[i].corporationid+"的"+this.corporationList[i].corporationname+"ISO20000即将到期","快到期提醒",{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                    })
                }
                if(this.corporationList[i].corporationISO27000!=946656000000&&this.corporationList[i].corporationISO27000-new Date().getTime()<10368000000)
                {
                    const confirmResult = await this.$confirm("id为"+this.corporationList[i].corporationid+"的"+this.corporationList[i].corporationname+"ISO27000即将到期","快到期提醒",{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                    })
                }
                if(this.corporationList[i].corporationfivestar!=946656000000&&this.corporationList[i].corporationfivestar-new Date().getTime()<10368000000)
                {
                    const confirmResult = await this.$confirm("id为"+this.corporationList[i].corporationid+"的"+this.corporationList[i].corporationname+"五星售后即将到期","快到期提醒",{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                    })
                }
                if(this.corporationList[i].corporationcombination!=946656000000&&this.corporationList[i].corporationcombination-new Date().getTime()<10368000000)
                {
                    const confirmResult = await this.$confirm("id为"+this.corporationList[i].corporationid+"的"+this.corporationList[i].corporationname+"两化融合即将到期","快到期提醒",{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                    })
                }
                if(this.corporationList[i].corporationjitc!=946656000000&&this.corporationList[i].corporationjitc-new Date().getTime()<10368000000)
                {
                    const confirmResult = await this.$confirm("id为"+this.corporationList[i].corporationid+"的"+this.corporationList[i].corporationname+"贯标时间即将到期","快到期提醒",{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                    })
                } 
            }
            for(let i=0;i<this.corporationList.length;i++){ 
                var ISO9001array = this.corporationList[i].corporationISO9001.split(",")
                console.log(ISO9001array,"ISO9001array")
                var array3C = this.corporationList[i].corporation3C.split(",")
                console.log(array3C,"array3C")
                if(ISO9001array!=''){
                     for(let k=0;k<ISO9001array.length;k++){
                        ISO9001array[k]=this.stringToDate(ISO9001array[k],'-')
                        if(ISO9001array[k]!=0&&ISO9001array[k]-new Date()<10368000000){
                            console.log(ISO9001array[k],"即将到期")
                            const confirmResult = await this.$confirm("id为"+this.corporationList[i].corporationid+"的"+this.corporationList[i].corporationname+"ISO9001即将到期","快到期提醒",{
                                confirmButtonText:'确定',
                                cancelButtonText:'取消',
                                type:'warning'
                                })
                        }
                    }
                }
               if(array3C!=''){
                    for(let k=0;k<array3C.length;k++){
                        array3C[k]=this.stringToDate(array3C[k],'-')
                        if(array3C[k]!=0&&array3C[k]-new Date()<10368000000){
                            console.log(array3C[k],"即将到期")
                            const confirmResult = await this.$confirm("id为"+this.corporationList[i].corporationid+"的"+this.corporationList[i].corporationname+"3C即将到期","快到期提醒",{
                                confirmButtonText:'确定',
                                cancelButtonText:'取消',
                                type:'warning'
                                })
                        }
                    }
                }
            }
        },
        // 是否拜访修改
        async VisitStateChanged(corporationInfo){
            const {data:res} = await this.$http.put(`visitstate?id=${corporationInfo.corporationid}&isvisit=${corporationInfo.isvisit}`);
            if (res!="success"){
               corporationInfo.corporationid = !corporationInfo.corporationid;
                return this.$message.error("状态修改失败！！！");
            }
            this.$message.success("状态修改成功!!!");
        },
        // 是否投标修改
        async biddingStateChanged(corporationInfo){
            const {data:res} = await this.$http.put(`biddingstate?id=${corporationInfo.corporationid}&bidding=${corporationInfo.corporationbidding}`);
            if (res!="success"){
               corporationInfo.corporationid = !corporationInfo.corporationid;
                return this.$message.error("状态修改失败！！！");
            }
            this.$message.success("状态修改成功!!!");
        },
        // pageNum触发动作
        handleCurrentChange(newPage){
            this.queryInfo.pageNum = newPage; 
            this.getCorporationList();   
        },
        // 最大数
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getCorporationList();
        },
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        }, 
        //添加信息
        addCorporation(){
            this.addForm.corporationISO9001=this.addForm.corporationISO9001+'';
            this.addForm.corporation3C=this.addForm.corporation3C+'';
            console.log(this.addForm,"this.addForm");
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid)return;
                const {data:res} = await this.$http.post("addcorporation",this.addForm);
                if(res!="success"){
                    return this.$message.error("操作失败！！！");
                }
                this.$message.success("操作成功!!!");
                this.addDialogVisible = false;
                this.getCorporationList();      
            });
        },    
        // 确认修改
        editCorporation(){
            if(this.editForm.corporationgxdqdate=="null"){
                 this.editForm.corporationgxdqdate = "2000-01-01"
             }
             if(this.editForm.corporationrqdqdate=="null"){
                 this.editForm.corporationrqdqdate = "2000-01-01"
             }
             if(this.editForm.corporationISO20000=="null"){
                 this.editForm.corporationISO20000 = "2000-01-01"
             }
             if(this.editForm.corporationISO27000=="null"){
                 this.editForm.corporationISO27000 = "2000-01-01"
             }
            if(this.editForm.corporationfivestar=="null"){
                 this.editForm.corporationfivestar = "2000-01-01"
             }
             if(this.editForm.corporationcombination=="null"){
                 this.editForm.corporationcombination = "2000-01-01"
             }
             if(this.editForm.corporationjitc=="null"){
                 this.editForm.corporationjitc = "2000-01-01"
             }
            console.log(this.editForm,"this.editFrom")
            this.editForm.corporationISO9001=this.editForm.corporationISO9001+'';
            this.editForm.corporation3C=this.editForm.corporation3C+'';
            this.$refs.editFormRef.validate(async valid =>{
                if(!valid) return;
                const {data:res} = await this.$http.put("editcorporation",this.editForm);
                if(res!="success")return this.$message.error("操作失败！");
                this.$message.success("操作成功！");
                this.editDialogVisible = false;
                this.getCorporationList();
            })
        },
      //删除信息
      async deleteCorporation(id){
            const confirmResult = await this.$confirm("是否确定删除该数据","提示",{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }).catch(err => err)
            if(confirmResult!='confirm'){
                return this.$message.info("已撤销删除");
            }
            const {data:res} = await this.$http.delete("deletecorporation?id="+id);
            if(res != "success"){
                return this.$message.error("删除失败！");
            }
            this.$message.success("删除成功！");
            this.getCorporationList();
        }, 
    async getClientList(corporationname){
        console.log("GET!",corporationname)
        const {data:res} = await this.$http.get("Corporationallclient?corporationname="+corporationname);
        this.ClientList = res;
        console.log(res);
    },
    indexMethod(index) {
        return index * 1;
      }
  }
}
</script>

<style scoped>
    .el-table .warning-row {
    background: red;
  }
  .el-table .success-row {
   background: #f0f9eb;
  }
</style>