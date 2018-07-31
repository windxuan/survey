<template>
  <el-table
    v-loading="loading"
    style="width: 100%"
    border
    stripe
    highlight-current-row
    ref="elTable"
    :data="data"
    @sort-change="sortChange">
    <!--id-->
    <el-table-column
      prop="[0]"
      label="ID"
      width="50px"
      align="center"
      sortable>
    </el-table-column>
    <!--姓名-->
    <el-table-column
      prop="[1][0].staff.name"
      label="姓名"
      align="center">
    </el-table-column>
    <!--性别-->
    <el-table-column
      prop="[1][0].staff.sex"
      label="性别"
      width="80px"
      align="center">
    </el-table-column>
    <!--  善始善终者 CF -->
    <el-table-column label="CF" align="center">
      <el-table-column label="善始善终" align="center">
        <template slot-scope="scope">
          <i :style="{'background': $utils.tagColor('CF', scope.row[1][0].score)}"></i>
          {{ $utils.convertScore('CF', scope.row[1][0].score) }}
        </template>
      </el-table-column>
    </el-table-column>
    <!--  协调者 CO -->
    <el-table-column label="CO" align="center">
      <el-table-column label="协调者" align="center">
        <template slot-scope="scope">
          <i :style="{'background': $utils.tagColor('CO', scope.row[1][1].score)}"></i>
          {{ $utils.convertScore('CO', scope.row[1][1].score) }}
        </template>
      </el-table-column>
    </el-table-column>
    <!--  实干者 IM -->
    <el-table-column label="IM" align="center">
      <el-table-column label="实干者" align="center">
        <template slot-scope="scope">
          <i :style="{'background': $utils.tagColor('IM', scope.row[1][2].score)}"></i>
          {{ $utils.convertScore('IM', scope.row[1][2].score) }}
        </template>
      </el-table-column>
    </el-table-column>
    <!--  监督者 ME -->
    <el-table-column label="ME" align="center">
      <el-table-column label="监督者" align="center">
        <template slot-scope="scope">
          <i :style="{'background': $utils.tagColor('ME', scope.row[1][3].score)}"></i>
          {{ $utils.convertScore('ME', scope.row[1][3].score) }}
        </template>
      </el-table-column>
    </el-table-column>
    <!--  智多星 PL -->
    <el-table-column label="PL" align="center">
      <el-table-column label="智多星" align="center">
        <template slot-scope="scope">
          <i :style="{'background': $utils.tagColor('PL', scope.row[1][4].score)}"></i>
          {{ $utils.convertScore('PL', scope.row[1][4].score) }}
        </template>
      </el-table-column>
    </el-table-column>
    <!--  外联者 RI -->
    <el-table-column label="RI" align="center">
      <el-table-column label="外联者" align="center">
        <template slot-scope="scope">
          <i :style="{'background': $utils.tagColor('RI', scope.row[1][5].score)}"></i>
          {{ $utils.convertScore('RI', scope.row[1][5].score) }}
        </template>
      </el-table-column>
    </el-table-column>
    <!--  鞭策者 SH -->
    <el-table-column label="SH" align="center">
      <el-table-column label="鞭策者" align="center">
        <template slot-scope="scope">
          <i :style="{'background': $utils.tagColor('SH', scope.row[1][6].score)}"></i>
          {{ $utils.convertScore('SH', scope.row[1][6].score) }}
        </template>
      </el-table-column>
    </el-table-column>
    <!--  专家 SP -->
    <el-table-column label="SP" align="center">
      <el-table-column label="专家" align="center">
        <template slot-scope="scope">
          <i :style="{'background': $utils.tagColor('SP', scope.row[1][7].score)}"></i>
          {{ $utils.convertScore('SP', scope.row[1][7].score) }}
        </template>
      </el-table-column>
    </el-table-column>
    <!--  凝聚者 TW -->
    <el-table-column label="TW" align="center">
    <el-table-column label="凝聚者" align="center">
      <template slot-scope="scope">
        <i :style="{'background': $utils.tagColor('TW', scope.row[1][8].score)}"></i>
        {{ $utils.convertScore('TW', scope.row[1][8].score) }}
      </template>
    </el-table-column>
    </el-table-column>
    <!--  最终结论  -->
    <el-table-column
      label="标签"
      align="center"
      width="100">
      <template slot-scope="scope">
        <el-tag
        type="success"
        size="small"
        v-for="val in scope.row[2]"
        :key="val.id">{{ val }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'TableSum',
  props: ['data'],
  data () {
    return {
      sort: true,
      loading: true
    }
  },
  updated () {
    if (this.data) {
      this.loading = false
    } else {
      this.loading = true
    }
  },
  methods: {
    sortChange (column) {
      this.$refs.elTable.clearSort()
      // this.clearSort()
      if (this.sort !== (column.order === 'ascending')) {
        this.$emit('sort', this.sort)
        this.sort = !this.sort
      }
    }
  }
}
</script>

<style scoped lang="less">
  .el-table {
    background: #fff;
    overflow: scroll;
    i {
      text-align: left;
      display: inline-block;
      width: 10px;
      height: 10px;
    }
    span {
      margin-right: 5px;
    }
  }
</style>
