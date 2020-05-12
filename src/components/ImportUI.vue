<template>
  <b-steps
    v-model="activeStep"
    :has-navigation="false">
    <b-step-item step="1" label="Select file" class="is-centered">
      <h1 class="title has-text-centered">Select file</h1>

      <FileUploader @input="onSelectFile" />
    </b-step-item>

    <b-step-item step="2" label="Match columns">
      <h1 class="title has-text-centered">Match columns</h1>

      <MatchFields
        v-model="matchedFields"
        :schema="schema"
        :header="header"
        :sample-rows="sampleRows"
        @submit="onClickUpload" />
    </b-step-item>

    <b-step-item step="3" label="Upload">
      <h1 class="title has-text-centered">Upload</h1>

      <b-progress
        :value="uploadProgress / count * 100"
        type="is-success"
        show-value>
        {{ uploadProgress }} / {{ count }}
      </b-progress>
    </b-step-item>
  </b-steps>
</template>

<script>
import FileUploader from '@/components/FileUploader'
import MatchFields from '@/components/MatchFields'
import { getPreview, upload } from '@/lib/csv'

export default {
  components: {
    FileUploader,
    MatchFields
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    uploadRow: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      file: null,
      header: null,
      count: null,
      sampleRows: null,
      matchedFields: null,
      uploadProgress: 0,
      activeStep: 0
    }
  },
  computed: {
    matchedFieldsWithIgnoresProcessed () {
      return this.matchedFields.map((field) => (field === '__ignore') ? null : field)
    }
  },
  methods: {
    async onSelectFile (file) {
      this.file = file
      const numSampleRows = 5
      const { sampleRows, count, header } = await getPreview(this.file, numSampleRows)
      this.header = header
      this.sampleRows = sampleRows
      this.count = count
      this.matchedFields = new Array(this.header.length)
      this.activeStep = 1
    },
    async onClickUpload () {
      this.activeStep++

      await upload({
        file: this.file,
        header: this.matchedFieldsWithIgnoresProcessed,
        delay: 200,
        onProgress: () => this.uploadProgress++,
        uploadFn: this.uploadRow
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
</style>
