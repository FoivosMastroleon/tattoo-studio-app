import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tattoo Studio API',
      version: '1.0.0',
      description: 'REST API for Tattoo Studio booking and management',
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'artist', 'customer'] },
            phone: { type: 'string', nullable: true },
            avatar: { type: 'string', nullable: true },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        TattooStyle: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            imageUrl: { type: 'string', nullable: true },
          },
        },
        GalleryImage: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            imageUrl: { type: 'string' },
            description: { type: 'string', nullable: true },
            style: { $ref: '#/components/schemas/TattooStyle', nullable: true },
            uploadedBy: { $ref: '#/components/schemas/User' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            imageUrl: { type: 'string', nullable: true },
            publishedBy: { $ref: '#/components/schemas/User' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Appointment: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            customer: { $ref: '#/components/schemas/User' },
            artist: { $ref: '#/components/schemas/User', nullable: true },
            tattooStyle: { $ref: '#/components/schemas/TattooStyle' },
            appointmentDate: { type: 'string', format: 'date-time' },
            timeSlot: { type: 'string', example: '10:00' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'completed', 'cancelled'] },
            clientNotes: { type: 'string', nullable: true },
            artistNotes: { type: 'string', nullable: true },
            referenceImageUrl: { type: 'string', nullable: true },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    paths: {
      // ── AUTH ──────────────────────────────────────────────────────────────
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password'],
                  properties: {
                    username: { type: 'string', minLength: 2 },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            409: { description: 'Email already in use', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login with email and password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/auth/google': {
        post: {
          tags: ['Auth'],
          summary: 'Login or register with Google',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['idToken'],
                  properties: { idToken: { type: 'string' } },
                },
              },
            },
          },
          responses: {
            200: { description: 'Google auth successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Invalid Google token', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current authenticated user',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Current user', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },

      // ── USERS ─────────────────────────────────────────────────────────────
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users (Admin only)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of users', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } },
            403: { description: 'Forbidden' },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by ID (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'User found', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            404: { description: 'User not found' },
          },
        },
        patch: {
          tags: ['Users'],
          summary: 'Update user (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    role: { type: 'string', enum: ['admin', 'artist', 'customer'] },
                    phone: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Updated user', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            404: { description: 'User not found' },
          },
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete user (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            204: { description: 'Deleted' },
            404: { description: 'User not found' },
          },
        },
      },

      // ── APPOINTMENTS ──────────────────────────────────────────────────────
      '/appointments': {
        get: {
          tags: ['Appointments'],
          summary: 'Get appointments (own for customer, all for admin/artist)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Appointments list', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Appointment' } } } } },
          },
        },
        post: {
          tags: ['Appointments'],
          summary: 'Create a new appointment',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['tattooStyle', 'appointmentDate', 'timeSlot'],
                  properties: {
                    tattooStyle: { type: 'string', description: 'TattooStyle ObjectId' },
                    appointmentDate: { type: 'string', format: 'date-time' },
                    timeSlot: { type: 'string', example: '10:00' },
                    clientNotes: { type: 'string' },
                    referenceImageUrl: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } } },
            400: { description: 'Validation error' },
          },
        },
      },
      '/appointments/{id}': {
        patch: {
          tags: ['Appointments'],
          summary: 'Update appointment (Admin/Artist only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    artistNotes: { type: 'string' },
                    artist: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Updated appointment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } } },
          },
        },
      },
      '/appointments/{id}/confirm': {
        patch: {
          tags: ['Appointments'],
          summary: 'Confirm appointment (Admin/Artist only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Confirmed', content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } } },
            400: { description: 'Cannot confirm' },
          },
        },
      },
      '/appointments/{id}/cancel': {
        patch: {
          tags: ['Appointments'],
          summary: 'Cancel appointment',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Cancelled', content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } } },
            403: { description: 'Forbidden' },
          },
        },
      },
      '/appointments/{id}/complete': {
        patch: {
          tags: ['Appointments'],
          summary: 'Complete appointment (Admin/Artist only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Completed', content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } } },
            400: { description: 'Cannot complete' },
          },
        },
      },

      // ── GALLERY ───────────────────────────────────────────────────────────
      '/gallery': {
        get: {
          tags: ['Gallery'],
          summary: 'Get all gallery images (public)',
          responses: {
            200: { description: 'Images list', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/GalleryImage' } } } } },
          },
        },
        post: {
          tags: ['Gallery'],
          summary: 'Upload gallery image (Admin/Artist only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'imageUrl'],
                  properties: {
                    title: { type: 'string' },
                    imageUrl: { type: 'string', format: 'uri' },
                    description: { type: 'string' },
                    style: { type: 'string', description: 'TattooStyle ObjectId' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Uploaded', content: { 'application/json': { schema: { $ref: '#/components/schemas/GalleryImage' } } } },
            403: { description: 'Forbidden' },
          },
        },
      },
      '/gallery/{id}': {
        delete: {
          tags: ['Gallery'],
          summary: 'Delete gallery image (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            204: { description: 'Deleted' },
            404: { description: 'Not found' },
          },
        },
      },

      // ── STYLES ────────────────────────────────────────────────────────────
      '/styles': {
        get: {
          tags: ['Styles'],
          summary: 'Get all tattoo styles (public)',
          responses: {
            200: { description: 'Styles list', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/TattooStyle' } } } } },
          },
        },
        post: {
          tags: ['Styles'],
          summary: 'Create tattoo style (Admin only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    imageUrl: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/TattooStyle' } } } },
            409: { description: 'Name already exists' },
          },
        },
      },
      '/styles/{id}': {
        put: {
          tags: ['Styles'],
          summary: 'Update tattoo style (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    imageUrl: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/TattooStyle' } } } },
            404: { description: 'Not found' },
          },
        },
        delete: {
          tags: ['Styles'],
          summary: 'Delete tattoo style (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            204: { description: 'Deleted' },
            404: { description: 'Not found' },
          },
        },
      },

      // ── POSTS ─────────────────────────────────────────────────────────────
      '/posts': {
        get: {
          tags: ['Posts'],
          summary: 'Get all posts (public)',
          responses: {
            200: { description: 'Posts list', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Post' } } } } },
          },
        },
        post: {
          tags: ['Posts'],
          summary: 'Create post (Admin only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'content'],
                  properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                    imageUrl: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } },
            403: { description: 'Forbidden' },
          },
        },
      },
      '/posts/{id}': {
        put: {
          tags: ['Posts'],
          summary: 'Update post (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                    imageUrl: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } },
            404: { description: 'Not found' },
          },
        },
        delete: {
          tags: ['Posts'],
          summary: 'Delete post (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            204: { description: 'Deleted' },
            404: { description: 'Not found' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
