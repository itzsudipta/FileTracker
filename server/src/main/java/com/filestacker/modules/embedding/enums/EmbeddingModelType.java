package com.filestacker.modules.embedding.enums;

public enum EmbeddingModelType {
    TEXT_EMBEDDING_ADA_002("text-embedding-ada-002"),
    TEXT_EMBEDDING_3_SMALL("text-embedding-3-small"),
    TEXT_EMBEDDING_3_LARGE("text-embedding-3-large");

    private final String modelName;

    EmbeddingModelType(String modelName) {
        this.modelName = modelName;
    }

    public String getModelName() {
        return modelName;
    }
}
