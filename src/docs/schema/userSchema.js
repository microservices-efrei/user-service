/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         role:
 *           type: string
 *           description: User's role
 *         registrationDate:
 *           type: date
 *           format: date-time
 *           description: Creation date of the user
 *         password:
 *           type: string
 *           description: User's password (hashed)
 *       required:
 *         - name
 *         - lastname
 *         - email
 *         - password
 */
