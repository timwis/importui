<template>
  <div>
    <h1 class="title">Import UI</h1>

    <b-steps
      v-model="activeStep"
      :has-navigation="false">
      <b-step-item step="1" label="Select file" class="is-centered">
        <h1 class="title has-text-centered">Select file</h1>
        <FileUploader @input="onSelectFile" />
      </b-step-item>

      <b-step-item step="2" label="Map fields">
        <h1 class="title has-text-centered">Map fields</h1>
        <div
          v-if="header"
          class="table-container">
          <table class="table is-striped preview">
            <thead>
              <tr>
                <th
                  v-for="col in header"
                  :key="'source-' + col">
                  {{ col }}
                </th>
              </tr>
              <tr>
                <th
                  v-for="(col, index) in header"
                  :key="'dest-' + col">
                  <b-field>
                    <b-select v-model="mappings[index]">
                      <option value="">Ignore this column</option>
                      <option
                        v-for="property in schemaProperties"
                        :key="property">
                        {{ property }}
                      </option>
                    </b-select>
                  </b-field>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in previewData"
                :key="index">
                <td
                  v-for="col in header"
                  :key="'preview-' + index + '-' + col">
                  {{ row[col] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <b-button
          type="is-primary"
          @click="onClickUpload">
          Upload
        </b-button>
      </b-step-item>
      <b-step-item step="3" label="Upload">
        <h1 class="title has-text-centered">Upload</h1>

        <b-progress :value="progress / count * 100" />
      </b-step-item>
    </b-steps>

  </div>
</template>

<script>
import FileUploader from '@/components/FileUploader'
import { getPreview, upload } from '@/lib/csv'
import axios from 'axios'
import schema from '../tests/fixtures/user.schema.json'

const client = axios.create({
  baseURL: 'https://enlf6yd1r00m.x.pipedream.net/'
})

export default {
  components: {
    FileUploader
  },
  data () {
    return {
      progress: 0,
      activeStep: 0,
      schema,
      file: null,
      header: null,
      previewData: null,
      count: null,
      mappings: null
    }
  },
  computed: {
    schemaProperties () {
      return Object.keys(this.schema.properties)
    }
  },
  methods: {
    async onSelectFile (file) {
      this.file = file
      const { sampleRows, count, header } = await getPreview(this.file, 5)
      this.header = header
      this.previewData = sampleRows
      this.count = count
      this.mappings = new Array(this.header.length).fill('')
      this.activeStep = 1
    },
    async onClickUpload () {
      this.activeStep++
      await upload({
        file: this.file,
        header: this.mappings,
        delay: 200,
        uploadFn: (data) => {
          return client.post('/users', data)
            .then(() => { this.progress++ })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .is-centered {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 600px;
    margin: 5% auto;
  }

  .preview {
    td {
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
