import ProjectQuery from '@/components/projects/PorjectQuery'
import { Suspense } from 'react'

const ProjectQueryPage = async () => {
  return (
    <Suspense>
      <ProjectQuery />
    </Suspense>
  )
}

export default ProjectQueryPage
