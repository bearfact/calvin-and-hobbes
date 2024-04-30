### Key takeaways

#### Routes
* Accepts the request  
* Define authentication and authorization     
* Formats and responds with appropriate http status codes
* Can throw http status code errors


#### Actions
* Business logic lives here.  
* This layer should operate all of its calls to services and never directly interact with models.  This keeps the data access and creation logic to a single point within a service.  


#### Services
* Makes use of models, and other child services, to persist and read data.
* Child services are those that should not be accessed directly, only through this parent, think has one relationships.
* Should not throw http errors

#### Models
* They're models you know the deal.
* Don't pull in other models into models unless they are true inner class type relationships.


#### Jobs & Workers
* Jobs are single modules
* They contain logic to validate their data.
* They have an enqueue method to leverage the validation and put the job on the queue.
* They have a work method that performs the actual task.
  

#### Key tools and packages

* No babel - no build needed - fast dev loop
* Bunyan - super great JSON formatted logging.
* Boom - standard well-formatted error messages.
* Joi - Object schema validator for req params and job params.
* dotenv - env variables in a single file.  Accessed through process.env within the application.
* RabbitMQ - for messaging and to task workers with a job.
