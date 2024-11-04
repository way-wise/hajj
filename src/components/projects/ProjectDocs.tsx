import { getCollections } from '@/utilities/getCollections'
import RichText from '../RichText'

const ProjectDocs = async ({ id }) => {
  const docs = getCollections({
    collection: 'project-documentations',
    where: {
      project: {
        equals: id,
      },
    },
  })
  console.log('docs', docs)
  //   useEffect(() => {
  //     const fetchProjectDocs = async () => {
  //       if (!id) return

  //       try {
  //         const response = await fetch(
  //           `${process.env.NEXT_PUBLIC_SERVER_URL}/api/project-documentations/${id}`,
  //         )

  //         if (!response.ok) {
  //           throw new Error('Network response was not ok')
  //         }

  //         const result = await response.json()
  //         setProjectDocs(result)
  //       } catch (error) {
  //         console.error('Failed to fetch project documentation', error)
  //       }
  //     }

  //     fetchProjectDocs()
  //   }, [id])

  console.log('ProjectDocs', ProjectDocs)
  return (
    <div>
      {/* <RichText
        className="lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[1fr]"
        content={docs.content}
        enableGutter={false}
      /> */}
    </div>
  )
}

export default ProjectDocs
