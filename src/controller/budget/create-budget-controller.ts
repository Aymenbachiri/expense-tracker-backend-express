export async function createBudget(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const parse = createBudgetSchema.safeParse({ body: req.body });
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: parse.error.errors,
      });
      return;
    }

    const budgetData = parse.data.body;

    // Check if category belongs to user
    const category = await checkCategoryOwnership(budgetData.category, userId);
    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found or does not belong to user',
      });
      return;
    }

    // Check if active budget already exists for this category
    const existingBudget = await Budget.findOne({
      userId,
      category: budgetData.category,
      isActive: true,
      $or: [
        {
          startDate: { $lte: budgetData.endDate },
          endDate: { $gte: budgetData.startDate },
        },
      ],
    });

    if (existingBudget) {
      res.status(409).json({
        success: false,
        message:
          'An active budget already exists for this category in the specified period',
      });
      return;
    }

    const budget = new Budget({ ...budgetData, userId });
    await budget.save();

    await budget.populate('category', 'name');

    res.status(201).json({
      success: true,
      data: budget,
      message: 'Budget created successfully',
    });
  } catch (error) {
    console.error('Failed to create budget:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create budget',
    });
  }
}
