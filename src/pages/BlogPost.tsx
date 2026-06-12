import { useParams } from 'react-router-dom'

export default function BlogPost() {
  const { slug } = useParams()
  return (
    <div className="pt-16">
      <div className="container-main py-20">
        <h1 className="text-4xl font-bold text-center">Blog Post: {slug}</h1>
      </div>
    </div>
  )
}
