import { Request, Response } from "express";
import {
  createSqueeze,
  getAllSqueezes,
  getSqueezeById,
} from "../services/squeeze.service";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * @swagger
 * /api/v1/squeeze:
 *   get:
 *     summary: Retrieve all squeezes
 *     description: Retrieve a list of all squeezes.
 *     tags: [Squeeze]
 *     responses:
 *       200:
 *         description: A list of squeezes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     squeezes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Squeeze'
 */
export const getAllSqueezesController = asyncHandler(
  async (req: Request, res: Response) => {
    const squeezes = await getAllSqueezes();

    res.status(200).json({
      status_code: 200,
      message: "Squeezes Retrieved successfully",
      data: {
        squeezes,
      },
    });
  }
);

/**
 * @swagger
 * /api/v1/squeeze:
 *   post:
 *     summary: Create a new squeeze
 *     description: Create a new squeeze with the provided details.
 *     tags: [Squeeze]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *               job_title:
 *                 type: string
 *               company:
 *                 type: string
 *               interests:
 *                 type: string
 *               referral_source:
 *                 type: string
 *     responses:
 *       201:
 *         description: Squeeze created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     squeeze:
 *                       $ref: '#/components/schemas/Squeeze'
 */
export const createSqueezeController = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      email,
      first_name,
      last_name,
      phone,
      location,
      job_title,
      company,
      interests,
      referral_source,
    } = req.body;

    const squeeze = await createSqueeze({
      email,
      first_name,
      last_name,
      phone,
      location,
      job_title,
      company,
      interests,
      referral_source,
    });

    res.status(201).json({
      status_code: 201,
      message: "Squeeze Created successfully",
      data: {
        squeeze,
      },
    });
  }
);

/**
 * @swagger
 * /api/v1/squeeze/{id}:
 *   get:
 *     summary: Retrieve a squeeze by ID
 *     description: Retrieve details of a squeeze by its ID.
 *     tags: [Squeeze]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the squeeze to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Squeeze retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     squeeze:
 *                       $ref: '#/components/schemas/Squeeze'
 *       404:
 *         description: Squeeze not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                 message:
 *                   type: string
 */
export const getSqueezeByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const squeeze = await getSqueezeById(id);

    if (!squeeze) {
      return res
        .status(404)
        .json({ status_code: 404, message: "Squeeze not found" });
    }

    res.status(200).json({
      status_code: 200,
      message: "Squeeze Retrieved successfully",
      data: {
        squeeze,
      },
    });
  }
);
