<template>
  <form @submit.prevent="$emit('submit')">
    <div v-if="header"
         class="table-container">
      <table class="table is-striped preview">
        <thead>
          <tr>
            <th v-for="col in header"
                :key="'source-' + col">
              {{ col }}
            </th>
          </tr>
          <tr>
            <th v-for="(col, colIndex) in header"
                :key="'dest-' + col"
                :class="{ 'is-ignored': value[colIndex] === '__ignore' }">
              <b-field>
                <b-select v-model="value[colIndex]"
                          placeholder="Map to field"
                          required>
                  <option value="__ignore">Ignore this column</option>
                  <option v-for="schemaKey in schemaKeys"
                          :key="schemaKey">
                    {{ schemaKey }}
                  </option>
                </b-select>
              </b-field>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in sampleRows"
              :key="rowIndex">
            <td v-for="(col, colIndex) in header"
                :key="'preview-' + rowIndex + '-' + col"
                :class="{ 'is-ignored': value[colIndex] === '__ignore' }">
              {{ row[col] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button
      type="submit"
      class="button is-primary">
      Upload
    </button>
  </form>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    schema: {
      type: Object,
      required: true
    },
    header: {
      type: Array,
      default: () => []
    },
    sampleRows: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    schemaKeys () {
      return Object.keys(this.schema.properties)
    }
  }
}
</script>

<style lang="scss" scoped>
  .preview {
    td {
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  th.is-ignored,
  td.is-ignored {
    background-color: #f5f5f5;
    color: hsla(0,0%,48%,.7);
  }
</style>
