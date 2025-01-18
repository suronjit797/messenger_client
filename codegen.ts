import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:5000/api/v1/graphql",
  documents: ["src/**/*.{graphql,gql,ts,tsx}"], // Includes GraphQL files and inline queries in .ts/.tsx
  generates: {
    "./src/__generated__/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql", // Matches gql usage in your app
      },
      plugins: [], // No additional plugins needed with the 'client' preset
    },
  },
  ignoreNoDocuments: true, // Avoids errors when no documents are found
};

export default config;
