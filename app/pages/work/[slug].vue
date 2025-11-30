<template>
  <main>
    <ProjectHero
      :title="project?.title"
      :subtitle="project?.subtitle"
      :media="project?.thumbnail"
      :collaborator="project?.info?.collaborator"
      :industry="project?.info?.industry"
      :partner="project?.info?.partner"
      :scope="project?.info?.scope"
      :team="project?.info?.team"
      :year="project?.info?.year"
    />
    <CenterInfo
      :text="project?.info?.overview"
      :label="'Case Study'"
      :truncate="true"
    />
    <ProjectCase :data="project?.caseStudy" />
    <ProjectNext :data="project?.next" />
  </main>
</template>

<script setup lang="ts">
import type { SanityDocument } from '@sanity/client';

const route = useRoute();
const slug = route.params.slug;

const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    subtitle,
    slug,
    thumbnail {
      mediaType,
      image {
        asset->,
        alt
      },
      muxVideo {
        asset-> {
          playbackId,
          assetId,
          filename,
          status,
          duration
        }
      }
    },
    info {
      overview,
      year,
      scope[] {
        text
      },
      industry[] {
        text
      },
      partner[] {
        text
      },
      team[] {
        text
      },
      collaborator[] {
        text
      }
    },
    caseStudy[] {
      _type,
      _key,
      layout,
      reverse,
      _type == "caseStudySingleImage" => {
        media {
          media {
            mediaType,
            image {
              asset-> {
                _id,
                _type,
                _ref,
                url,
                metadata {
                  lqip,
                  dimensions {
                    width,
                    height
                  }
                }
              },
              alt
            },
            muxVideo {
              asset-> {
                playbackId,
                assetId,
                filename,
                status,
                duration
              }
            }
          },
          text
        }
      },
      _type == "caseStudyDoubleMedia" => {
        media[] {
          media {
            mediaType,
            image {
              asset-> {
                _id,
                _type,
                _ref,
                url,
                metadata {
                  lqip,
                  dimensions {
                    width,
                    height
                  }
                }
              },
              alt
            },
            muxVideo {
              asset-> {
                playbackId,
                assetId,
                filename,
                status,
                duration
              }
            }
          },
          text
        }
      },
      _type in ["caseStudy444", "caseStudy6666", "caseStudy444444"] => {
        media[] {
          media {
            mediaType,
            image {
              asset-> {
                _id,
                _type,
                _ref,
                url,
                metadata {
                  lqip,
                  dimensions {
                    width,
                    height
                  }
                }
              },
              alt
            },
            muxVideo {
              asset-> {
                playbackId,
                assetId,
                filename,
                status,
                duration
              }
            }
          },
          text
        }
      },
      _type in ["caseStudy12444", "caseStudy1266"] => {
        top {
          media {
            mediaType,
            image {
              asset-> {
                _id,
                _type,
                _ref,
                url,
                metadata {
                  lqip,
                  dimensions {
                    width,
                    height
                  }
                }
              },
              alt
            },
            muxVideo {
              asset-> {
                playbackId,
                assetId,
                filename,
                status,
                duration
              }
            }
          },
          text
        },
        bottom[] {
          media {
            mediaType,
            image {
              asset-> {
                _id,
                _type,
                _ref,
                url,
                metadata {
                  lqip,
                  dimensions {
                    width,
                    height
                  }
                }
              },
              alt
            },
            muxVideo {
              asset-> {
                playbackId,
                assetId,
                filename,
                status,
                duration
              }
            }
          },
          text
        }
      }
    },
    "next": coalesce(
      *[_type == "project" && _createdAt < ^._createdAt] | order(_createdAt desc)[0],
      *[_type == "project"] | order(_createdAt desc)[0]
    ) {
      title,
      subtitle,
      slug,
      thumbnail {
        mediaType,
        image {
          asset->,
          alt
        },
        muxVideo {
          asset-> {
            playbackId,
            assetId,
            filename,
            status,
            duration
          }
        }
      }
    }
  }`;

const { data: project } = await useSanityQuery<SanityDocument>(PROJECT_QUERY, {
  slug: slug as string,
});
</script>
