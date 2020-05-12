<template>
  <div>
    <h1 class="title">{{ title }}</h1>

    <ImportUI
      :schema="schema"
      :uploadRow="uploadRow" />
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/config'
import ImportUI from '@/components/ImportUI'

const { title, schema, baseURL, url, method } = config
const client = axios.create({ baseURL })

export default {
  components: {
    ImportUI
  },
  data () {
    return {
      title,
      schema
    }
  },
  methods: {
    uploadRow: (data) => client({ data, url, method })
  }
}
</script>
