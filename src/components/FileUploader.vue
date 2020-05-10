<template>
  <section>
    <b-field>
      <b-upload
        v-model="file"
        drag-drop
        accept=".csv"
        @input="$emit('input', $event)">
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon
                icon="upload"
                size="is-large" />
            </p>
            <p>Drop your files here or click to upload</p>
          </div>
        </section>
      </b-upload>
    </b-field>

    <div class="tags">
      <span
        v-if="file"
        class="tag is-primary">
        {{file.name}}
        <button
          class="delete is-small"
          type="button"
          @click="deleteFile" />
      </span>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      file: null
    }
  },
  methods: {
    deleteFile () {
      this.file = null
    }
  }
}
</script>
