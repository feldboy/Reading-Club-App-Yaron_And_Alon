import { Request, Response } from 'express';
import Club from '../models/Club.model';

export const getClubs = async (_req: Request, res: Response) => {
    try {
        const clubs = await Club.find().populate('members', 'username profilePicture').sort({ createdAt: -1 });
        // Add isJoined flag based on current user if authenticated?
        // For now returning raw clubs. Frontend can calculate isJoined if we pass user ID context or do it here.
        // Let's return simple list first.
        res.json(clubs);
        return;
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
};

export const createClub = async (req: Request, res: Response) => {
    try {
        const { name, description, category, cover, isPrivate } = req.body;

        const userId = req.tokenPayload?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const newClub = new Club({
            name,
            description,
            category,
            cover,
            isPrivate,
            admin: userId,
            members: [userId] // Creator is strictly a member
        });

        const savedClub = await newClub.save();
        res.status(201).json(savedClub);
        return;
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
};

export const joinClub = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.tokenPayload?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const club = await Club.findById(id);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        if (club.members.some(member => member.toString() === userId)) {
            return res.status(400).json({ message: 'Already a member' });
        }

        club.members.push(userId as any);
        await club.save();

        res.json(club);
        return;
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
};

export const leaveClub = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.tokenPayload?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const club = await Club.findById(id);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        club.members = club.members.filter(memberId => memberId.toString() !== userId);
        await club.save();

        res.json(club);
        return;
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
};
