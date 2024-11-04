'use client'
import api from '@/utilities/axios'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Textarea } from '../ui/textarea'
import { stringify } from 'qs-esm'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '../ui/multi-select'
import { Feature, Service } from '@/payload-types'
import { toast } from 'sonner'
import { useFieldArray, useForm } from 'react-hook-form'

const ProjectQuery = () => {
  const [docsUploadError, setDocsUploadError] = useState('')
  const [services, setServices] = useState<{ label: string; value: string }[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [description, setDescription] = useState<string>('')
  const [maxBudget, setMaxBudget] = useState<number>(0)
  const [minBudget, setMinBudget] = useState<number>(0)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm()
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'links', // unique name for your Field Array
  })

  const handleProjectQuery = async ({ name, email, links, description }) => {
    try {
      if (selectedServices.length === 0) {
        toast.error('Minimum one service need to be selected')
        return
      }

      let data = {
        title: 'untitled',
        services: selectedServices,
        features: selectedFeatures,
        maxPrice: maxBudget,
        minPrice: minBudget,
        description: description,
        docsLinks: links,
        clientName: name,
        clientEmail: email,
      }

      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project-query`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      toast.success('Signup successfull!')
    } catch (err) {
      toast.error(err)
    }
  }
  const handleError = (errors) => {
    console.log(errors)
  }

  useEffect(() => {
    const getServices = async () => {
      try {
        const stringifiedQuery = stringify(
          {
            limit: 100,
            where: {
              isActive: {
                equals: true,
              },
            },
          },
          { addQueryPrefix: true },
        )
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/services${stringifiedQuery}`,
        )
        const data = await req.json()
        const docs = data.docs || []
        let serviceData: any = []
        docs.map((el) => serviceData.push({ label: el.title, value: el.id }))
        setServices(serviceData)
      } catch (err) {
        console.log(err)
      }
    }
    getServices()
  }, [])

  useEffect(() => {
    const getFeatures = async (selectedServices) => {
      try {
        const stringifiedQuery = stringify(
          {
            limit: 300,
            where: {
              isActive: {
                equals: true,
              },
              service: {
                in: selectedServices,
              },
            },
          },
          { addQueryPrefix: true },
        )
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/features${stringifiedQuery}`,
        )
        const data = await req.json()
        setFeatures(data.docs || [])
      } catch (err) {
        console.log(err)
      }
    }
    getFeatures(selectedServices)
  }, [selectedServices])

  const handleFeatureChange = (checked, id) => {
    const newFeatures = JSON.parse(JSON.stringify(selectedFeatures))
    const currentFeatures = checked ? [...newFeatures, id] : newFeatures.filter((el) => el !== id)
    setSelectedFeatures(currentFeatures)
  }

  const getBadget = () => {
    if (features && features.length > 0) {
      const newFeatures = JSON.parse(JSON.stringify(features))
      let minBadgetData = 0
      let maxBadgetData = 0
      newFeatures.map((feature) => {
        if (selectedFeatures.includes(feature.id)) {
          minBadgetData += feature.minPrice
          maxBadgetData += feature.maxPrice
        }
      })
      if (maxBadgetData !== maxBudget) {
        setMaxBudget(maxBadgetData)
      }
      if (minBadgetData !== minBudget) {
        setMinBudget(minBadgetData)
      }
      return `$${minBadgetData} - $${maxBadgetData}`
    }
    return `$0`
  }

  const projectQueryOptions = {
    name: {
      required: 'Name is required',
    },
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
        message: 'Email not valid',
      },
    },
  }

  return (
    <form
      onSubmit={handleSubmit(handleProjectQuery, handleError)}
      className="max-w-3xl mx-auto my-10 "
    >
      <h1 className="text-2xl font-semibold mb-2 text-center">Get a quote for upcoming project</h1>
      <p className="mb-6 text-gray-600 text-center">
        Choose the service you need, then provide details to help us understand your requirements
        and deliver the best results.
      </p>
      <div className="space-y-4">
        <div>
          <label>Select Services</label>
          <MultiSelector
            values={selectedServices}
            onValuesChange={setSelectedServices}
            options={services}
            loop={false}
          >
            <MultiSelectorTrigger>
              <MultiSelectorInput placeholder="Select Services" />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {services &&
                  services.length > 0 &&
                  services.map((option, i) => (
                    <MultiSelectorItem key={i} value={option.value}>
                      {option.label}
                    </MultiSelectorItem>
                  ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
        </div>
        {features && (
          <>
            <h6>
              Project features (Optional){' '}
              {!(features.length > 1) && (
                <span className="text-xs text-red-500 animate-bounce ">
                  Please choose at least two
                </span>
              )}
            </h6>

            <div className="space-y-3 ml-2 max-h-[150px] overflow-y-auto">
              {features?.map((feature) => (
                <div key={feature?.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedFeatures.includes(feature.id)}
                    onCheckedChange={(checked) => handleFeatureChange(checked, feature.id)}
                    id={feature.id}
                  />
                  <label
                    htmlFor={feature.id}
                    className="!mb-0 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {feature.name}
                  </label>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Project Description */}
        <div>
          <label>Brief project summary </label>

          <Textarea
            placeholder="Provide a detailed description of your project requirements"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Document Upload */}
        <div>
          <label>
            Upload Documents (Optional){' '}
            {docsUploadError && <span className="text-red-500 text-xs">{docsUploadError}</span>}
          </label>
          <Input
            type="file"
            onChange={(e: any) => {
              const maxSize = 5 * 1024 * 1024
              const files = e.target.files
              let errorMessage = ''

              for (let i = 0; i < files.length; i++) {
                if (files[i].size > maxSize) {
                  setDocsUploadError(`File ${files[i].name} exceeds the maximum size of 5MB.`)
                  break // Break on the first error
                } else {
                  setServiceInfo((prev: any) => ({ ...prev, docs: [...prev.docs, files[i]] }))
                  setDocsUploadError('')
                }
              }

              if (errorMessage) {
                console.error(errorMessage) // Handle error as needed
              }
            }}
            accept=".pdf,.doc,.jpg,.png"
            multiple
            max={5}
          />
        </div>

        <div className="pt-5">
          <div className="flex gap-5 items-center mb-4">
            <label>Add reference Links (Optional)</label>
            <span
              className="inline-flex items-center justify-center h-8 gap-2 px-4 text-xs font-medium cursor-pointer tracking-wide text-white transition duration-300 rounded focus-visible:outline-none whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
              onClick={() => append({ link: '' })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-plus-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </svg>
              add link
            </span>
          </div>
          <ul className="list-none py-4 pt-4 flex flex-col space-y-4">
            {fields.map((item, index) => (
              <li key={item.id} className="flex items-center gap-3">
                <Input type="text" placeholder="link" {...register(`links.${index}.link`)} />
                <span className="text-red-600 cursor-pointer" onClick={() => remove(index)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-trash"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <hr />

        {selectedFeatures.length > 0 && <p>Your estimated budget is: {getBadget()}</p>}

        <h6>Your Contact Information</h6>
        <div className="flex items-center gap-5">
          <Input
            type="text"
            placeholder="Name"
            {...register('name', projectQueryOptions.name)}
            disabled={isSubmitting}
          />

          <Input
            type="email"
            placeholder="Email"
            {...register('email', projectQueryOptions.email)}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
            {isSubmitting && (
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
            Submit
          </Button>
        </div>
      </div>
    </form>
  )
}

export default ProjectQuery
